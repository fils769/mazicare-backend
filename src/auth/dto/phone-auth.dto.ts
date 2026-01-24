import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsPhoneNumber,
  ValidateIf,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '@prisma/client';

export enum VerificationMethod {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

// Helper function to normalize phone field
function normalizePhone(value: any, obj: any) {
  // If phone exists but phoneNumber doesn't, copy phone to phoneNumber
  if (obj.phone && !obj.phoneNumber) {
    obj.phoneNumber = obj.phone;
  }
  return value;
}

export class UnifiedSignupDto {
  @ValidateIf((o) => o.verificationMethod === VerificationMethod.EMAIL)
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @Transform(({ value, obj }) => normalizePhone(value, obj))
  @ValidateIf((o) => o.verificationMethod === VerificationMethod.PHONE)
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  phone?: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsEnum(VerificationMethod)
  verificationMethod: VerificationMethod;
}

export class UnifiedVerifyOtpDto {
  @ValidateIf((o) => o.verificationMethod === VerificationMethod.EMAIL)
  @IsEmail()
  email?: string;

  @Transform(({ value, obj }) => normalizePhone(value, obj))
  @ValidateIf((o) => o.verificationMethod === VerificationMethod.PHONE)
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(6)
  otp: string;

  @IsEnum(VerificationMethod)
  verificationMethod: VerificationMethod;
}

export class UnifiedCreatePasswordDto {
  @ValidateIf((o) => o.verificationMethod === VerificationMethod.EMAIL)
  @IsEmail()
  email?: string;

  @Transform(({ value, obj }) => normalizePhone(value, obj))
  @ValidateIf((o) => o.verificationMethod === VerificationMethod.PHONE)
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsEnum(VerificationMethod)
  verificationMethod: VerificationMethod;
}

export class UnifiedLoginDto {
  @ValidateIf((o) => o.verificationMethod === VerificationMethod.EMAIL)
  @IsEmail()
  email?: string;

  @Transform(({ value, obj }) => normalizePhone(value, obj))
  @ValidateIf((o) => o.verificationMethod === VerificationMethod.PHONE)
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  phone?: string;

  @IsString()
  password: string;

  @IsEnum(VerificationMethod)
  verificationMethod: VerificationMethod;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class UnifiedForgotPasswordDto {
  @ValidateIf((o) => o.verificationMethod === VerificationMethod.EMAIL)
  @IsEmail()
  email?: string;

  @Transform(({ value, obj }) => normalizePhone(value, obj))
  @ValidateIf((o) => o.verificationMethod === VerificationMethod.PHONE)
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  phone?: string;

  @IsEnum(VerificationMethod)
  verificationMethod: VerificationMethod;
}

export class UnifiedResetPasswordDto {
  @ValidateIf((o) => o.verificationMethod === VerificationMethod.EMAIL)
  @IsEmail()
  email?: string;

  @Transform(({ value, obj }) => normalizePhone(value, obj))
  @ValidateIf((o) => o.verificationMethod === VerificationMethod.PHONE)
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(6)
  otp: string;

  @IsString()
  @MinLength(8)
  newPassword: string;

  @IsEnum(VerificationMethod)
  verificationMethod: VerificationMethod;
}

export class UnifiedResendOtpDto {
  @IsString()
  identifier: string; // Can be email or phone

  @IsEnum(VerificationMethod)
  verificationMethod: VerificationMethod;
}