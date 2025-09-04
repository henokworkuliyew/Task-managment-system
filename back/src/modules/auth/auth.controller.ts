import { Controller, Post, HttpCode, HttpStatus, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { ThrottlerGuard } from "@nestjs/throttler"

import type { AuthService } from "./auth.service"
import { Public } from "../../common/decorators/public.decorator"
import type { RegisterDto } from "./dtos/register.dto"
import type { LoginDto } from "./dtos/login.dto"
import type { ForgotPasswordDto } from "./dtos/forgot-password.dto"
import type { ResetPasswordDto } from "./dtos/reset-password.dto"
import type { RefreshTokenDto } from "./dtos/refresh-token.dto"
import type { VerifyOtpDto } from "./dtos/verify-otp.dto"

@ApiTags("auth")
@Controller("auth")
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User successfully registered" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async register(registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ status: 200, description: "User successfully logged in" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Public()
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Request password reset" })
  @ApiResponse({ status: 200, description: "Password reset email sent" })
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email)
  }

  @Public()
  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reset password with token" })
  @ApiResponse({ status: 200, description: "Password successfully reset" })
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword)
  }

  @Public()
  @Post("verify-otp")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify OTP code" })
  @ApiResponse({ status: 200, description: "OTP successfully verified" })
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp)
  }

  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh access token" })
  @ApiResponse({ status: 200, description: "Token successfully refreshed" })
  async refresh(refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken)
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Logout user" })
  @ApiResponse({ status: 200, description: "User successfully logged out" })
  async logout(req) {
    return this.authService.logout(req.user.id)
  }
}
