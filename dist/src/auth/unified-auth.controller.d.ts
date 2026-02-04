import { UnifiedAuthService } from './unified-auth.service';
import { UnifiedSignupDto, UnifiedVerifyOtpDto, UnifiedCreatePasswordDto, UnifiedLoginDto, UnifiedForgotPasswordDto, UnifiedResetPasswordDto, UnifiedResendOtpDto } from './dto/phone-auth.dto';
export declare class UnifiedAuthController {
    private readonly unifiedAuthService;
    constructor(unifiedAuthService: UnifiedAuthService);
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
}
