import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import {
  SignupDto,
  LoginDto,
  VerifyOtpDto,
  CreatePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './auth.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user by email' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({ status: 201, description: 'OTP sent to email' })
  async signup(@Body(ValidationPipe) signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify signup OTP' })
  @ApiBody({ type: VerifyOtpDto })
  async verifyOtp(@Body(ValidationPipe) verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('verify-forgot-password-otp')
  @ApiOperation({ summary: 'Verify forgot password OTP' })
  @ApiBody({ type: VerifyOtpDto })
  async verifyForgotPasswordOtp(
    @Body(ValidationPipe) verifyOtpDto: VerifyOtpDto,
  ) {
    return this.authService.verifyForgotPasswordOtp(verifyOtpDto);
  }

  @Post('create-password')
  @ApiOperation({ summary: 'Create a password after verification' })
  @ApiBody({ type: CreatePasswordDto })
  async createPassword(
    @Body(ValidationPipe) createPasswordDto: CreatePasswordDto,
  ) {
    return this.authService.createPassword(createPasswordDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and receive JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'JWT access token' })
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset OTP' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(
    @Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(
    @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve authenticated user profile' })
  @ApiBearerAuth('bearer')
  async getProfile(@GetUser() user: any) {
    return { user };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout current user (stateless acknowledgement)' })
  @ApiBearerAuth('bearer')
  async logout() {
    return this.authService.logout();
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend signup OTP code' })
  async resendOtp(@Body('email') email: string) {
    return this.authService.resendOtp(email);
  }

  @Post('resend-forgot-password-otp')
  @ApiOperation({ summary: 'Resend forgot password OTP code' })
  async resendForgotPasswordOtp(@Body('email') email: string) {
    return this.authService.resendForgotPasswordOtp(email);
  }
}
