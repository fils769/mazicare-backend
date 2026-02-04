import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SignupDto, LoginDto, VerifyOtpDto, CreatePasswordDto, ResetPasswordDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private transporter;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
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
    forgotPassword(email: string): Promise<{
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
    logout(): Promise<{
        message: string;
    }>;
    resendOtp(email: string): Promise<{
        message: string;
    }>;
    resendForgotPasswordOtp(email: string): Promise<{
        message: string;
    }>;
    private generateOtp;
    private sendOtpEmail;
}
