import { AuthService } from './auth.service';
import { SignupDto, LoginDto, VerifyOtpDto, CreatePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto): Promise<{
        message: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    verifyForgotPasswordOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    createPassword(createPasswordDto: CreatePasswordDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
    getProfile(user: any): Promise<{
        user: any;
    }>;
    logout(): Promise<{
        message: string;
    }>;
    resendOtp(email: string): Promise<{
        message: string;
    }>;
    resendForgotPasswordOtp(email: string): Promise<{
        message: string;
    }>;
}
