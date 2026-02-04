import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { TwilioService } from './twilio.service';
import { UnifiedSignupDto, UnifiedVerifyOtpDto, UnifiedCreatePasswordDto, UnifiedLoginDto, UnifiedForgotPasswordDto, UnifiedResetPasswordDto, UnifiedResendOtpDto } from './dto/phone-auth.dto';
export declare class UnifiedAuthService {
    private prisma;
    private jwtService;
    private emailService;
    private twilioService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, emailService: EmailService, twilioService: TwilioService);
    signup(signupDto: UnifiedSignupDto): Promise<{
        message: string;
    }>;
    verifyOtp(verifyOtpDto: UnifiedVerifyOtpDto): Promise<{
        message: string;
    }>;
    createPassword(createPasswordDto: UnifiedCreatePasswordDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            phoneNumber: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.AccountStatus;
        };
    }>;
    login(loginDto: UnifiedLoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            phoneNumber: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.AccountStatus;
        };
    }>;
    forgotPassword(forgotPasswordDto: UnifiedForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: UnifiedResetPasswordDto): Promise<{
        message: string;
    }>;
    resendOtp(resendOtpDto: UnifiedResendOtpDto): Promise<{
        message: string;
    }>;
    private findUserByIdentifier;
    private generateOTP;
    private createOTP;
    private sendOTP;
    private sendPasswordResetOTP;
}
