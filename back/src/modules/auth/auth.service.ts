import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Inject,
  Optional,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { User } from '../../entities/user.entity' // Changed from type import to regular import for decorator usage
import type { RegisterDto } from './dtos/register.dto'
import type { LoginDto } from './dtos/login.dto'
import { EmailService } from './email.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    })

    if (existingUser) {
      throw new ConflictException('User with this email already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
    })

    const savedUser = await this.userRepository.save(user)

    // Generate tokens
    const tokens = await this.generateTokens(savedUser)

    // Save refresh token
    await this.updateRefreshToken(savedUser.id, tokens.refreshToken)

    // Send welcome email
    try {
      if (this.emailService) {
        await this.emailService.add('welcome', {
          email: savedUser.email,
          name: savedUser.name,
        });
      } else {
        console.log(`Mock email would be sent to ${savedUser.email} with type: welcome`);
      }
    } catch (error) {
      // Log the error but don't fail the registration process
      console.error('Failed to send welcome email:', error.message);
    }

    return {
      user: this.sanitizeUser(savedUser),
      ...tokens,
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    // Find user with password
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
      select: ['id', 'email', 'password', 'name', 'role', 'avatar'],
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Generate tokens
    const tokens = await this.generateTokens(user)

    // Save refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    const response = {
      user: this.sanitizeUser(user),
      ...tokens,
    }

    console.log('Auth Service - Login response structure:', {
      hasUser: !!response.user,
      hasAccessToken: !!response.accessToken,
      hasRefreshToken: !!response.refreshToken,
      responseKeys: Object.keys(response)
    })

    return response
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } })

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If the email exists, a reset link has been sent' }
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Save reset token
    await this.userRepository.update(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpires,
    })

    // Send reset email
    await this.emailService.add('password-reset', {
      email: user.email,
      name: user.name,
      resetToken,
    })

    return { message: 'If the email exists, a reset link has been sent' }
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
      },
    })

    if (!user || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token')
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password and clear reset token
    await this.userRepository.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      refreshToken: null, // Invalidate all sessions
    })

    return { message: 'Password successfully reset' }
  }

  async generateOtp(email: string) {
    const user = await this.userRepository.findOne({ where: { email } })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // Save OTP
    await this.userRepository.update(user.id, {
      otpCode: otp,
      otpExpires,
    })

    // Send OTP email
    await this.emailService.add('otp', {
      email: user.email,
      name: user.name,
      otp,
    })

    return { message: 'OTP sent to your email' }
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    })

    if (!user || user.otpCode !== otp || user.otpExpires < new Date()) {
      throw new BadRequestException('Invalid or expired OTP')
    }

    // Clear OTP
    await this.userRepository.update(user.id, {
      otpCode: null,
      otpExpires: null,
    })

    return { message: 'OTP verified successfully' }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      })

      const user = await this.userRepository.findOne({
        where: { id: payload.sub, refreshToken },
      })

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token')
      }

      const tokens = await this.generateTokens(user)
      await this.updateRefreshToken(user.id, tokens.refreshToken)

      return tokens
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  async logout(userId: string) {
    await this.userRepository.update(userId, { refreshToken: null })
    return { message: 'Successfully logged out' }
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    console.log('Auth Service - Generating tokens for payload:', payload)

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn:
          this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
      }),
    ])

    console.log('Auth Service - Tokens generated successfully')

    return {
      accessToken,
      refreshToken,
    }
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    })
  }

  private sanitizeUser(user: User) {
    const {
      password,
      refreshToken,
      resetPasswordToken,
      otpCode,
      ...sanitized
    } = user
    return sanitized
  }

  async validateUser(payload: any): Promise<User> {
    console.log('Auth Service - Validating user with payload:', payload)
    
    const user = await this.userRepository.findOne({
      where: { id: payload.sub, isActive: true },
    })

    if (!user) {
      console.log('Auth Service - User not found or inactive for ID:', payload.sub)
      throw new UnauthorizedException()
    }

    console.log('Auth Service - User found and active:', user.id, user.email)
    return user
  }
}
