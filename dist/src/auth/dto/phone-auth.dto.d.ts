import { UserRole } from '@prisma/client';
export declare enum VerificationMethod {
    EMAIL = "EMAIL",
    PHONE = "PHONE"
}
export declare class UnifiedSignupDto {
    email?: string;
    phoneNumber?: string;
    phone?: string;
    role: UserRole;
    verificationMethod: VerificationMethod;
}
export declare class UnifiedVerifyOtpDto {
    email?: string;
    phoneNumber?: string;
    phone?: string;
    otp: string;
    verificationMethod: VerificationMethod;
}
export declare class UnifiedCreatePasswordDto {
    email?: string;
    phoneNumber?: string;
    phone?: string;
    password: string;
    verificationMethod: VerificationMethod;
}
export declare class UnifiedLoginDto {
    email?: string;
    phoneNumber?: string;
    phone?: string;
    password: string;
    verificationMethod: VerificationMethod;
    rememberMe?: boolean;
}
export declare class UnifiedForgotPasswordDto {
    email?: string;
    phoneNumber?: string;
    phone?: string;
    verificationMethod: VerificationMethod;
}
export declare class UnifiedResetPasswordDto {
    email?: string;
    phoneNumber?: string;
    phone?: string;
    otp: string;
    newPassword: string;
    verificationMethod: VerificationMethod;
}
export declare class UnifiedResendOtpDto {
    identifier: string;
    verificationMethod: VerificationMethod;
}
