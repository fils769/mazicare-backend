import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';

enum UserRole {
  ADMIN = 'ADMIN',
  CAREGIVER = 'CAREGIVER',
  FAMILY = 'FAMILY',
}

export class SignupDto {
  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;

  @IsOptional()
  @IsString()
  type?: string;
}

export class CreatePasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
