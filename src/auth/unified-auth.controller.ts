import {
  Controller,
  Post,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UnifiedAuthService } from './unified-auth.service';
import {
  UnifiedSignupDto,
  UnifiedVerifyOtpDto,
  UnifiedCreatePasswordDto,
  UnifiedLoginDto,
  UnifiedForgotPasswordDto,
  UnifiedResetPasswordDto,
  UnifiedResendOtpDto,
} from './dto/phone-auth.dto';

@ApiTags('Unified Auth')
@Controller('auth/unified')
export class UnifiedAuthController {
  constructor(private readonly unifiedAuthService: UnifiedAuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user by email or phone' })
  @ApiBody({ type: UnifiedSignupDto })
  @ApiResponse({ status: 201, description: 'OTP sent to email or phone' })
  async signup(@Body(ValidationPipe) signupDto: UnifiedSignupDto) {
    return this.unifiedAuthService.signup(signupDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify signup OTP' })
  @ApiBody({ type: UnifiedVerifyOtpDto })
  async verifyOtp(@Body(ValidationPipe) verifyOtpDto: UnifiedVerifyOtpDto) {
    return this.unifiedAuthService.verifyOtp(verifyOtpDto);
  }

  @Post('create-password')
  @ApiOperation({ summary: 'Create a password after verification' })
  @ApiBody({ type: UnifiedCreatePasswordDto })
  async createPassword(
    @Body(ValidationPipe) createPasswordDto: UnifiedCreatePasswordDto,
  ) {
    return this.unifiedAuthService.createPassword(createPasswordDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user by email or phone and receive JWT' })
  @ApiBody({ type: UnifiedLoginDto })
  @ApiResponse({ status: 200, description: 'JWT access token' })
  async login(@Body(ValidationPipe) loginDto: UnifiedLoginDto) {
    return this.unifiedAuthService.login(loginDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset OTP' })
  @ApiBody({ type: UnifiedForgotPasswordDto })
  async forgotPassword(
    @Body(ValidationPipe) forgotPasswordDto: UnifiedForgotPasswordDto,
  ) {
    return this.unifiedAuthService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiBody({ type: UnifiedResetPasswordDto })
  async resetPassword(
    @Body(ValidationPipe) resetPasswordDto: UnifiedResetPasswordDto,
  ) {
    return this.unifiedAuthService.resetPassword(resetPasswordDto);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend signup OTP code' })
  @ApiBody({ type: UnifiedResendOtpDto })
  async resendOtp(@Body(ValidationPipe) resendOtpDto: UnifiedResendOtpDto) {
    return this.unifiedAuthService.resendOtp(resendOtpDto);
  }
}
