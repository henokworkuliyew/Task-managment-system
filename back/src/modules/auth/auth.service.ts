import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
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
import { PendingRegistration } from '../../entities/pending-registration.entity'
import type { RegisterDto } from './dtos/register.dto'
import type { LoginDto } from './dtos/login.dto'
import { EmailService } from './email.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PendingRegistration)
    private readonly pendingRegistrationRepository: Repository<PendingRegistration>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto

    const existingUser = await this.userRepository.findOne({
      where: { email },
    })

    if (existingUser) {
      throw new ConflictException('User with this email already exists')
    }

    const existingPending = await this.pendingRegistrationRepository.findOne({
      where: { email },
    })

    if (existingPending) {
      await this.pendingRegistrationRepository.remove(existingPending)
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const pendingRegistration = this.pendingRegistrationRepository.create({
      email,
      password: hashedPassword,
      name,
      otpCode: otp,
      otpExpires,
    })

    const savedPending = await this.pendingRegistrationRepository.save(pendingRegistration)

    try {
      if (this.emailService) {
        await this.emailService.add('otp', {
          email: savedPending.email,
          name: savedPending.name,
          otp,
        });
      }
    } catch (error) {
      console.error('Failed to send OTP email:', error.message);
      console.log(`🔐 FALLBACK - OTP for ${savedPending.email}: ${otp}`);
    }

    return {
      message: 'Registration initiated. Please verify your email with the OTP sent to your email address to complete registration.',
      email: savedPending.email,
      name: savedPending.name
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
      select: ['id', 'email', 'password', 'name', 'role', 'avatar', 'isEmailVerified'],
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email address before logging in')
    }

    const tokens = await this.generateTokens(user)

    await this.updateRefreshToken(user.id, tokens.refreshToken)

    const response = {
      user: this.sanitizeUser(user),
      ...tokens,
    }

    return response
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } })

    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' }
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    await this.userRepository.update(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpires,
    })

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

    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await this.userRepository.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      refreshToken: null, // Invalidate all sessions
    })

    return { message: 'Password successfully reset' }
  }

  async generateOtp(email: string) {
    const pendingRegistration = await this.pendingRegistrationRepository.findOne({ 
      where: { email } 
    })

    if (!pendingRegistration) {
      throw new BadRequestException('No pending registration found for this email')
    }

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Update pending registration with new OTP
    await this.pendingRegistrationRepository.update(pendingRegistration.id, {
      otpCode: otp,
      otpExpires,
    })

    // Send OTP email
    await this.emailService.add('otp', {
      email: pendingRegistration.email,
      name: pendingRegistration.name,
      otp,
    })

    return { message: 'New OTP sent to your email' }
  }

  async verifyOtp(email: string, otp: string) {
    // Find pending registration by email
    const pendingRegistration = await this.pendingRegistrationRepository.findOne({
      where: { email },
    })

    if (!pendingRegistration) {
      throw new NotFoundException('No pending registration found for this email')
    }

    // Check if OTP is valid and not expired
    if (pendingRegistration.otpCode !== otp) {
      throw new BadRequestException('Invalid OTP')
    }

    if (pendingRegistration.otpExpires < new Date()) {
      throw new BadRequestException('OTP has expired')
    }

    // Create the actual user now that OTP is verified
    const user = this.userRepository.create({
      email: pendingRegistration.email,
      password: pendingRegistration.password,
      name: pendingRegistration.name,
      isEmailVerified: true,
    })

    const savedUser = await this.userRepository.save(user)

    // Remove the pending registration
    await this.pendingRegistrationRepository.remove(pendingRegistration)


    return {
      message: 'Registration completed successfully. You can now login.',
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        isEmailVerified: true,
      },
    }
  }

  async verifyEmail(token: string) {
    const user = await this.userRepository.findOne({
      where: {
        emailVerificationToken: token,
      },
    })

    if (!user || user.emailVerificationExpires < new Date()) {
      throw new BadRequestException('Invalid or expired verification token')
    }

    // Mark email as verified and clear verification token
    await this.userRepository.update(user.id, {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    })

    return { message: 'Email verified successfully' }
  }

  async resendVerificationEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified')
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Save new verification token
    await this.userRepository.update(user.id, {
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    })

    // Send verification email
    await this.emailService.add('email-verification', {
      email: user.email,
      name: user.name,
      verificationToken,
    })

    return { message: 'Verification email sent' }
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

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn:
          this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
      }),
    ])

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

  async validateUser(payload: { sub: string; email: string; role: string }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub, isActive: true },
    })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
