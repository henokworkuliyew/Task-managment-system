import { Controller, Post, HttpCode, HttpStatus, UseGuards, Body, Inject, Request } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { ThrottlerGuard } from "@nestjs/throttler"

import { AuthService } from './auth.service'
import { Public } from "../../common/decorators/public.decorator"
import { RegisterDto } from "./dtos/register.dto"
import { LoginDto } from "./dtos/login.dto"
import { ForgotPasswordDto } from "./dtos/forgot-password.dto"
import { ResetPasswordDto } from "./dtos/reset-password.dto"
import { RefreshTokenDto } from "./dtos/refresh-token.dto"
import { VerifyOtpDto } from "./dtos/verify-otp.dto"
import { VerifyEmailDto } from "./dtos/verify-email.dto"
import { ResendVerificationDto } from "./dtos/resend-verification.dto"

@ApiTags("auth")
@Controller("auth")
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService
  ) {}

  @Public()
  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User successfully registered" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ status: 200, description: "User successfully logged in" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Public()
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Request password reset" })
  @ApiResponse({ status: 200, description: "Password reset email sent" })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email)
  }

  @Public()
  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reset password with token" })
  @ApiResponse({ status: 200, description: "Password successfully reset" })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword)
  }

  @Public()
  @Post("verify-otp")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify OTP code" })
  @ApiResponse({ status: 200, description: "OTP successfully verified" })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp)
  }

  @Public()
  @Post("generate-otp")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Generate and send OTP" })
  @ApiResponse({ status: 200, description: "OTP sent successfully" })
  async generateOtp(@Body() body: { email: string }) {
    return this.authService.generateOtp(body.email)
  }

  @Public()
  @Post("verify-email")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify email address" })
  @ApiResponse({ status: 200, description: "Email successfully verified" })
  @ApiResponse({ status: 400, description: "Invalid or expired token" })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto.token)
  }

  @Public()
  @Post("resend-verification")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Resend email verification" })
  @ApiResponse({ status: 200, description: "Verification email sent" })
  @ApiResponse({ status: 400, description: "User not found or email already verified" })
  async resendVerification(@Body() resendVerificationDto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(resendVerificationDto.email)
  }

  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh access token" })
  @ApiResponse({ status: 200, description: "Token successfully refreshed" })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken)
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Logout user" })
  @ApiResponse({ status: 200, description: "User successfully logged out" })
  async logout(@Request() req) {
    const userId = req.user?.id;
    if (userId) {
      return this.authService.logout(userId);
    }
    // If no user ID, just return success (token is already invalid)
    return { message: "Logged out successfully" };
  }

}
