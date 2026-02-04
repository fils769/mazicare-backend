declare enum UserRole {
    ADMIN = "ADMIN",
    CAREGIVER = "CAREGIVER",
    FAMILY = "FAMILY"
}
export declare class SignupDto {
    email: string;
    role: UserRole;
}
export declare class LoginDto {
    email: string;
    password: string;
    rememberMe?: boolean;
}
export declare class VerifyOtpDto {
    email: string;
    otp: string;
    type?: string;
}
export declare class CreatePasswordDto {
    email: string;
    password: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    email: string;
    password: string;
}
export {};
