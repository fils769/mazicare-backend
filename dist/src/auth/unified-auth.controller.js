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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedAuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const unified_auth_service_1 = require("./unified-auth.service");
const phone_auth_dto_1 = require("./dto/phone-auth.dto");
let UnifiedAuthController = class UnifiedAuthController {
    unifiedAuthService;
    constructor(unifiedAuthService) {
        this.unifiedAuthService = unifiedAuthService;
    }
    async signup(signupDto) {
        return this.unifiedAuthService.signup(signupDto);
    }
    async verifyOtp(verifyOtpDto) {
        return this.unifiedAuthService.verifyOtp(verifyOtpDto);
    }
    async createPassword(createPasswordDto) {
        return this.unifiedAuthService.createPassword(createPasswordDto);
    }
    async login(loginDto) {
        return this.unifiedAuthService.login(loginDto);
    }
    async forgotPassword(forgotPasswordDto) {
        return this.unifiedAuthService.forgotPassword(forgotPasswordDto);
    }
    async resetPassword(resetPasswordDto) {
        return this.unifiedAuthService.resetPassword(resetPasswordDto);
    }
    async resendOtp(resendOtpDto) {
        return this.unifiedAuthService.resendOtp(resendOtpDto);
    }
};
exports.UnifiedAuthController = UnifiedAuthController;
__decorate([
    (0, common_1.Post)('signup'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user by email or phone' }),
    (0, swagger_1.ApiBody)({ type: phone_auth_dto_1.UnifiedSignupDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'OTP sent to email or phone' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [phone_auth_dto_1.UnifiedSignupDto]),
    __metadata("design:returntype", Promise)
], UnifiedAuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify signup OTP' }),
    (0, swagger_1.ApiBody)({ type: phone_auth_dto_1.UnifiedVerifyOtpDto }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [phone_auth_dto_1.UnifiedVerifyOtpDto]),
    __metadata("design:returntype", Promise)
], UnifiedAuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('create-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a password after verification' }),
    (0, swagger_1.ApiBody)({ type: phone_auth_dto_1.UnifiedCreatePasswordDto }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [phone_auth_dto_1.UnifiedCreatePasswordDto]),
    __metadata("design:returntype", Promise)
], UnifiedAuthController.prototype, "createPassword", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Authenticate user by email or phone and receive JWT' }),
    (0, swagger_1.ApiBody)({ type: phone_auth_dto_1.UnifiedLoginDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'JWT access token' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [phone_auth_dto_1.UnifiedLoginDto]),
    __metadata("design:returntype", Promise)
], UnifiedAuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Request password reset OTP' }),
    (0, swagger_1.ApiBody)({ type: phone_auth_dto_1.UnifiedForgotPasswordDto }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [phone_auth_dto_1.UnifiedForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], UnifiedAuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password using OTP' }),
    (0, swagger_1.ApiBody)({ type: phone_auth_dto_1.UnifiedResetPasswordDto }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [phone_auth_dto_1.UnifiedResetPasswordDto]),
    __metadata("design:returntype", Promise)
], UnifiedAuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    (0, swagger_1.ApiOperation)({ summary: 'Resend signup OTP code' }),
    (0, swagger_1.ApiBody)({ type: phone_auth_dto_1.UnifiedResendOtpDto }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [phone_auth_dto_1.UnifiedResendOtpDto]),
    __metadata("design:returntype", Promise)
], UnifiedAuthController.prototype, "resendOtp", null);
exports.UnifiedAuthController = UnifiedAuthController = __decorate([
    (0, swagger_1.ApiTags)('Unified Auth'),
    (0, common_1.Controller)('auth/unified'),
    __metadata("design:paramtypes", [unified_auth_service_1.UnifiedAuthService])
], UnifiedAuthController);
//# sourceMappingURL=unified-auth.controller.js.map