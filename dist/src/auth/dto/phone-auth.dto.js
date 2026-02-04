"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedResendOtpDto = exports.UnifiedResetPasswordDto = exports.UnifiedForgotPasswordDto = exports.UnifiedLoginDto = exports.UnifiedCreatePasswordDto = exports.UnifiedVerifyOtpDto = exports.UnifiedSignupDto = exports.VerificationMethod = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
var VerificationMethod;
(function (VerificationMethod) {
    VerificationMethod["EMAIL"] = "EMAIL";
    VerificationMethod["PHONE"] = "PHONE";
})(VerificationMethod || (exports.VerificationMethod = VerificationMethod = {}));
function normalizePhone(value, obj) {
    if (obj.phone && !obj.phoneNumber) {
        obj.phoneNumber = obj.phone;
    }
    return value;
}
class UnifiedSignupDto {
    email;
    phoneNumber;
    phone;
    role;
    verificationMethod;
}
exports.UnifiedSignupDto = UnifiedSignupDto;
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.verificationMethod === VerificationMethod.EMAIL),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    __metadata("design:type", String)
], UnifiedSignupDto.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value, obj }) => normalizePhone(value, obj)),
    (0, class_validator_1.ValidateIf)((o) => o.verificationMethod === VerificationMethod.PHONE),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UnifiedSignupDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UnifiedSignupDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.UserRole),
    __metadata("design:type", String)
], UnifiedSignupDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(VerificationMethod),
    __metadata("design:type", String)
], UnifiedSignupDto.prototype, "verificationMethod", void 0);
class UnifiedVerifyOtpDto {
    email;
    phoneNumber;
    phone;
    otp;
    verificationMethod;
}
exports.UnifiedVerifyOtpDto = UnifiedVerifyOtpDto;
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.verificationMethod === VerificationMethod.EMAIL),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UnifiedVerifyOtpDto.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value, obj }) => normalizePhone(value, obj)),
    (0, class_validator_1.ValidateIf)((o) => o.verificationMethod === VerificationMethod.PHONE),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UnifiedVerifyOtpDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UnifiedVerifyOtpDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], UnifiedVerifyOtpDto.prototype, "otp", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(VerificationMethod),
    __metadata("design:type", String)
], UnifiedVerifyOtpDto.prototype, "verificationMethod", void 0);
class UnifiedCreatePasswordDto {
    email;
    phoneNumber;
    phone;
    password;
    verificationMethod;
}
exports.UnifiedCreatePasswordDto = UnifiedCreatePasswordDto;
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.verificationMethod === VerificationMethod.EMAIL),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UnifiedCreatePasswordDto.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value, obj }) => normalizePhone(value, obj)),
    (0, class_validator_1.ValidateIf)((o) => o.verificationMethod === VerificationMethod.PHONE),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UnifiedCreatePasswordDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UnifiedCreatePasswordDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    __metadata("design:type", String)
], UnifiedCreatePasswordDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(VerificationMethod),
    __metadata("design:type", String)
], UnifiedCreatePasswordDto.prototype, "verificationMethod", void 0);
class UnifiedLoginDto {
    email;
    phoneNumber;
    phone;
    password;
    verificationMethod;
    rememberMe;
}
exports.UnifiedLoginDto = UnifiedLoginDto;
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.verificationMethod === VerificationMethod.EMAIL),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UnifiedLoginDto.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value, obj }) => normalizePhone(value, obj)),
    (0, class_validator_1.ValidateIf)((o) => o.verificationMethod === VerificationMethod.PHONE),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UnifiedLoginDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UnifiedLoginDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UnifiedLoginDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(VerificationMethod),
    __metadata("design:type", String)
], UnifiedLoginDto.prototype, "verificationMethod", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UnifiedLoginDto.prototype, "rememberMe", void 0);
class UnifiedForgotPasswordDto {
    email;
    phoneNumber;
    phone;
    verificationMethod;
}
exports.UnifiedForgotPasswordDto = UnifiedForgotPasswordDto;
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.verificationMethod === VerificationMethod.EMAIL),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UnifiedForgotPasswordDto.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value, obj }) => normalizePhone(value, obj)),
    (0, class_validator_1.ValidateIf)((o) => o.verificationMethod === VerificationMethod.PHONE),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UnifiedForgotPasswordDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UnifiedForgotPasswordDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(VerificationMethod),
    __metadata("design:type", String)
], UnifiedForgotPasswordDto.prototype, "verificationMethod", void 0);
class UnifiedResetPasswordDto {
    email;
    phoneNumber;
    phone;
    otp;
    newPassword;
    verificationMethod;
}
exports.UnifiedResetPasswordDto = UnifiedResetPasswordDto;
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.verificationMethod === VerificationMethod.EMAIL),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UnifiedResetPasswordDto.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value, obj }) => normalizePhone(value, obj)),
    (0, class_validator_1.ValidateIf)((o) => o.verificationMethod === VerificationMethod.PHONE),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UnifiedResetPasswordDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UnifiedResetPasswordDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], UnifiedResetPasswordDto.prototype, "otp", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], UnifiedResetPasswordDto.prototype, "newPassword", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(VerificationMethod),
    __metadata("design:type", String)
], UnifiedResetPasswordDto.prototype, "verificationMethod", void 0);
class UnifiedResendOtpDto {
    identifier;
    verificationMethod;
}
exports.UnifiedResendOtpDto = UnifiedResendOtpDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UnifiedResendOtpDto.prototype, "identifier", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(VerificationMethod),
    __metadata("design:type", String)
], UnifiedResendOtpDto.prototype, "verificationMethod", void 0);
//# sourceMappingURL=phone-auth.dto.js.map