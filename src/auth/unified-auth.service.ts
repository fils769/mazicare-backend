import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { TwilioService } from './twilio.service';
import {
  UnifiedSignupDto,
  UnifiedVerifyOtpDto,
  UnifiedCreatePasswordDto,
  UnifiedLoginDto,
  UnifiedForgotPasswordDto,
  UnifiedResetPasswordDto,
  UnifiedResendOtpDto,
  VerificationMethod,
} from './dto/phone-auth.dto';
import { OtpType } from '@prisma/client';

@Injectable()
export class UnifiedAuthService {
  private readonly logger = new Logger(UnifiedAuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private twilioService: TwilioService,
  ) {}

  async signup(signupDto: UnifiedSignupDto) {
    const { email, phoneNumber, phone, role, verificationMethod } = signupDto;

    // Normalize phone field
    const normalizedPhone = phoneNumber || phone;

    // Validate that the correct identifier is provided
    if (verificationMethod === VerificationMethod.EMAIL && !email) {
      throw new BadRequestException('Email is required for email verification');
    }
    if (verificationMethod === VerificationMethod.PHONE && !normalizedPhone) {
      throw new BadRequestException('Phone number is required for phone verification');
    }

    const identifier = verificationMethod === VerificationMethod.EMAIL ? email! : normalizedPhone!;

    // Check if user already exists
    const existingUser = await this.findUserByIdentifier(identifier, verificationMethod);

    if (existingUser) {
      const identifierType = verificationMethod === VerificationMethod.EMAIL ? 'email' : 'phone number';
      throw new ConflictException(`User with this ${identifierType} already exists`);
    }

    // Create user
    const userData: any = {
      role,
      status: 'PENDING',
    };

    if (verificationMethod === VerificationMethod.EMAIL) {
      userData.email = email;
    } else {
      userData.phoneNumber = normalizedPhone;
      userData.email = `temp_${Date.now()}@mazicare.temp`; // Temporary email for unique constraint
    }

    const user = await this.prisma.user.create({
      data: userData,
    });

    // Generate and send OTP
    const otp = this.generateOTP();

    await this.createOTP(identifier, otp, OtpType.SIGNUP, verificationMethod);

    // Send OTP
    const sent = await this.sendOTP(identifier, otp, verificationMethod);
    if (!sent) {
      // Clean up user if OTP sending failed
      await this.prisma.user.delete({ where: { id: user.id } });
      
      if (verificationMethod === VerificationMethod.PHONE) {
        throw new BadRequestException(
          'Failed to send SMS verification code. Please check your phone number or try email verification instead.'
        );
      } else {
        throw new BadRequestException('Failed to send verification code');
      }
    }

    const method = verificationMethod === VerificationMethod.EMAIL ? 'email' : 'phone';
    return { message: `OTP sent to ${method}` };
  }

  async verifyOtp(verifyOtpDto: UnifiedVerifyOtpDto) {
    const { email, phoneNumber, phone, otp, verificationMethod } = verifyOtpDto;
    const normalizedPhone = phoneNumber || phone;
    const identifier = verificationMethod === VerificationMethod.EMAIL ? email! : normalizedPhone!;

    // Find and validate OTP
    const otpRecord = await this.prisma.otp.findFirst({
      where: {
        identifier,
        otp,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Mark OTP as used
    await this.prisma.otp.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // Update user verification status
    const updateData: any = {};
    if (verificationMethod === VerificationMethod.EMAIL) {
      updateData.isVerified = true;
    } else {
      updateData.phoneVerified = true;
    }

    await this.prisma.user.update({
      where: verificationMethod === VerificationMethod.EMAIL 
        ? { email } 
        : { phoneNumber },
      data: updateData,
    });

    const method = verificationMethod === VerificationMethod.EMAIL ? 'Email' : 'Phone';
    return { message: `${method} verified successfully` };
  }

  async createPassword(createPasswordDto: UnifiedCreatePasswordDto) {
    const { email, phoneNumber, phone, password, verificationMethod } = createPasswordDto;
    const normalizedPhone = phoneNumber || phone;
    const identifier = verificationMethod === VerificationMethod.EMAIL ? email! : normalizedPhone!;

    // Find user
    const user = await this.findUserByIdentifier(identifier, verificationMethod);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if user is verified
    const isVerified = verificationMethod === VerificationMethod.EMAIL 
      ? user.isVerified 
      : user.phoneVerified;

    if (!isVerified) {
      throw new BadRequestException('Please verify your account first');
    }

    // Hash password and update user
    const hashedPassword = await bcrypt.hash(password, 12);
    const updateData: any = {
      password: hashedPassword,
      // Only FAMILY and ADMIN become ACTIVE automatically
      // CAREGIVER remains PENDING until admin approval
      status: user.role === 'CAREGIVER' ? 'PENDING' : 'ACTIVE',
    };

    // Update email if it was temporary
    if (verificationMethod === VerificationMethod.PHONE && user.email?.includes('@mazicare.temp')) {
      updateData.email = null;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    };
  }

  async login(loginDto: UnifiedLoginDto) {
    const { email, phoneNumber, phone, password, verificationMethod, rememberMe } = loginDto;
    const normalizedPhone = phoneNumber || phone;
    const identifier = verificationMethod === VerificationMethod.EMAIL ? email! : normalizedPhone!;

    // Find user
    const user = await this.findUserByIdentifier(identifier, verificationMethod);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is verified
    const isVerified = verificationMethod === VerificationMethod.EMAIL 
      ? user.isVerified 
      : user.phoneVerified;

    if (!isVerified) {
      throw new UnauthorizedException('Please verify your account first');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const tokenOptions: any = rememberMe ? { expiresIn: '30d' } : { expiresIn: '24h' };
    const access_token = this.jwtService.sign(payload, tokenOptions);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        status: user.status,
      },
    };
  }

  async forgotPassword(forgotPasswordDto: UnifiedForgotPasswordDto) {
    const { email, phoneNumber, phone, verificationMethod } = forgotPasswordDto;
    const normalizedPhone = phoneNumber || phone;
    const identifier = verificationMethod === VerificationMethod.EMAIL ? email! : normalizedPhone!;

    // Find user
    const user = await this.findUserByIdentifier(identifier, verificationMethod);
    if (!user) {
      // Don't reveal if user exists or not
      const method = verificationMethod === VerificationMethod.EMAIL ? 'email' : 'phone';
      return { message: `If an account with this ${method} exists, you will receive a reset code` };
    }

    // Generate and send OTP
    const otp = this.generateOTP();
    await this.createOTP(identifier, otp, OtpType.PASSWORD_RESET, verificationMethod);

    const sent = await this.sendPasswordResetOTP(identifier, otp, verificationMethod);
    if (!sent) {
      if (verificationMethod === VerificationMethod.PHONE) {
        throw new BadRequestException(
          'Failed to send SMS reset code. Please try email reset instead or contact support.'
        );
      } else {
        throw new BadRequestException('Failed to send reset code');
      }
    }

    const method = verificationMethod === VerificationMethod.EMAIL ? 'email' : 'phone';
    return { message: `Password reset OTP sent to ${method}` };
  }

  async resetPassword(resetPasswordDto: UnifiedResetPasswordDto) {
    const { email, phoneNumber, phone, otp, newPassword, verificationMethod } = resetPasswordDto;
    const normalizedPhone = phoneNumber || phone;
    const identifier = verificationMethod === VerificationMethod.EMAIL ? email! : normalizedPhone!;

    // Find and validate OTP
    const otpRecord = await this.prisma.otp.findFirst({
      where: {
        identifier,
        otp,
        type: OtpType.PASSWORD_RESET,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    // Find user
    const user = await this.findUserByIdentifier(identifier, verificationMethod);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Update password and mark OTP as used
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await Promise.all([
      this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      this.prisma.otp.update({
        where: { id: otpRecord.id },
        data: { used: true },
      }),
    ]);

    return { message: 'Password reset successfully' };
  }

  async resendOtp(resendOtpDto: UnifiedResendOtpDto) {
    const { identifier, verificationMethod } = resendOtpDto;

    // Find user
    const user = await this.findUserByIdentifier(identifier, verificationMethod);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate new OTP
    const otp = this.generateOTP();
    await this.createOTP(identifier, otp, OtpType.SIGNUP, verificationMethod);

    // Send OTP
    const sent = await this.sendOTP(identifier, otp, verificationMethod);
    if (!sent) {
      if (verificationMethod === VerificationMethod.PHONE) {
        throw new BadRequestException(
          'Failed to resend SMS verification code. Please try email verification instead.'
        );
      } else {
        throw new BadRequestException('Failed to resend verification code');
      }
    }

    const method = verificationMethod === VerificationMethod.EMAIL ? 'email' : 'phone';
    return { message: `OTP resent to ${method}` };
  }

  // Helper methods
  private async findUserByIdentifier(identifier: string, method: VerificationMethod) {
    if (method === VerificationMethod.EMAIL) {
      return this.prisma.user.findUnique({ where: { email: identifier } });
    } else {
      return this.prisma.user.findUnique({ where: { phoneNumber: identifier } });
    }
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async createOTP(
    identifier: string,
    otp: string,
    type: OtpType,
    method: VerificationMethod,
  ) {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

    const otpData: any = {
      identifier,
      otp,
      type,
      expiresAt,
    };

    if (method === VerificationMethod.EMAIL) {
      otpData.email = identifier;
    } else {
      otpData.phoneNumber = identifier;
    }

    return this.prisma.otp.create({ data: otpData });
  }

  private async sendOTP(identifier: string, otp: string, method: VerificationMethod): Promise<boolean> {
    if (method === VerificationMethod.EMAIL) {
      return this.emailService.sendOTP(identifier, otp);
    } else {
      return this.twilioService.sendOTP(identifier, otp);
    }
  }

  private async sendPasswordResetOTP(
    identifier: string,
    otp: string,
    method: VerificationMethod,
  ): Promise<boolean> {
    if (method === VerificationMethod.EMAIL) {
      return this.emailService.sendPasswordResetOTP(identifier, otp);
    } else {
      return this.twilioService.sendPasswordResetOTP(identifier, otp);
    }
  }
}