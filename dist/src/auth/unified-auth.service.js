"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UnifiedAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
const twilio_service_1 = require("./twilio.service");
const phone_auth_dto_1 = require("./dto/phone-auth.dto");
const client_1 = require("@prisma/client");
let UnifiedAuthService = UnifiedAuthService_1 = class UnifiedAuthService {
    prisma;
    jwtService;
    emailService;
    twilioService;
    logger = new common_1.Logger(UnifiedAuthService_1.name);
    constructor(prisma, jwtService, emailService, twilioService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.twilioService = twilioService;
    }
    async signup(signupDto) {
        const { email, phoneNumber, phone, role, verificationMethod } = signupDto;
        const normalizedPhone = phoneNumber || phone;
        if (verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL && !email) {
            throw new common_1.BadRequestException('Email is required for email verification');
        }
        if (verificationMethod === phone_auth_dto_1.VerificationMethod.PHONE && !normalizedPhone) {
            throw new common_1.BadRequestException('Phone number is required for phone verification');
        }
        const identifier = verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL ? email : normalizedPhone;
        const existingUser = await this.findUserByIdentifier(identifier, verificationMethod);
        if (existingUser) {
            const identifierType = verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL ? 'email' : 'phone number';
            throw new common_1.ConflictException(`User with this ${identifierType} already exists`);
        }
        const userData = {
            role,
            status: 'PENDING',
        };
        if (verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL) {
            userData.email = email;
        }
        else {
            userData.phoneNumber = normalizedPhone;
            userData.email = `temp_${Date.now()}@mazicare.temp`;
        }
        const user = await this.prisma.user.create({
            data: userData,
        });
        const otp = this.generateOTP();
        await this.createOTP(identifier, otp, client_1.OtpType.SIGNUP, verificationMethod);
        const sent = await this.sendOTP(identifier, otp, verificationMethod);
        if (!sent) {
            await this.prisma.user.delete({ where: { id: user.id } });
            if (verificationMethod === phone_auth_dto_1.VerificationMethod.PHONE) {
                throw new common_1.BadRequestException('Failed to send SMS verification code. Please check your phone number or try email verification instead.');
            }
            else {
                throw new common_1.BadRequestException('Failed to send verification code');
            }
        }
        const method = verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL ? 'email' : 'phone';
        return { message: `OTP sent to ${method}` };
    }
    async verifyOtp(verifyOtpDto) {
        const { email, phoneNumber, phone, otp, verificationMethod } = verifyOtpDto;
        const normalizedPhone = phoneNumber || phone;
        const identifier = verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL ? email : normalizedPhone;
        const otpRecord = await this.prisma.otp.findFirst({
            where: {
                identifier,
                otp,
                used: false,
                expiresAt: { gt: new Date() },
            },
        });
        if (!otpRecord) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        await this.prisma.otp.update({
            where: { id: otpRecord.id },
            data: { used: true },
        });
        const updateData = {};
        if (verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL) {
            updateData.isVerified = true;
        }
        else {
            updateData.phoneVerified = true;
        }
        await this.prisma.user.update({
            where: verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL
                ? { email }
                : { phoneNumber },
            data: updateData,
        });
        const method = verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL ? 'Email' : 'Phone';
        return { message: `${method} verified successfully` };
    }
    async createPassword(createPasswordDto) {
        const { email, phoneNumber, phone, password, verificationMethod } = createPasswordDto;
        const normalizedPhone = phoneNumber || phone;
        const identifier = verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL ? email : normalizedPhone;
        const user = await this.findUserByIdentifier(identifier, verificationMethod);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const isVerified = verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL
            ? user.isVerified
            : user.phoneVerified;
        if (!isVerified) {
            throw new common_1.BadRequestException('Please verify your account first');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const updateData = {
            password: hashedPassword,
            status: user.role === 'CAREGIVER' ? 'PENDING' : 'ACTIVE',
        };
        if (verificationMethod === phone_auth_dto_1.VerificationMethod.PHONE && user.email?.includes('@mazicare.temp')) {
            updateData.email = null;
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: updateData,
        });
        const payload = { sub: user.id, email: user.email, role: user.role };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                phoneNumber: updatedUser.phoneNumber,
                role: updatedUser.role,
                status: updatedUser.status,
            },
        };
    }
    async login(loginDto) {
        const { email, phoneNumber, phone, password, verificationMethod, rememberMe } = loginDto;
        const normalizedPhone = phoneNumber || phone;
        const identifier = verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL ? email : normalizedPhone;
        const user = await this.findUserByIdentifier(identifier, verificationMethod);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.password || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isVerified = verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL
            ? user.isVerified
            : user.phoneVerified;
        if (!isVerified) {
            throw new common_1.UnauthorizedException('Please verify your account first');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const tokenOptions = rememberMe ? { expiresIn: '30d' } : { expiresIn: '24h' };
        const access_token = this.jwtService.sign(payload, tokenOptions);
        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                status: user.status,
            },
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email, phoneNumber, phone, verificationMethod } = forgotPasswordDto;
        const normalizedPhone = phoneNumber || phone;
        const identifier = verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL ? email : normalizedPhone;
        const user = await this.findUserByIdentifier(identifier, verificationMethod);
        if (!user) {
            const method = verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL ? 'email' : 'phone';
            return { message: `If an account with this ${method} exists, you will receive a reset code` };
        }
        const otp = this.generateOTP();
        await this.createOTP(identifier, otp, client_1.OtpType.PASSWORD_RESET, verificationMethod);
        const sent = await this.sendPasswordResetOTP(identifier, otp, verificationMethod);
        if (!sent) {
            if (verificationMethod === phone_auth_dto_1.VerificationMethod.PHONE) {
                throw new common_1.BadRequestException('Failed to send SMS reset code. Please try email reset instead or contact support.');
            }
            else {
                throw new common_1.BadRequestException('Failed to send reset code');
            }
        }
        const method = verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL ? 'email' : 'phone';
        return { message: `Password reset OTP sent to ${method}` };
    }
    async resetPassword(resetPasswordDto) {
        const { email, phoneNumber, phone, otp, newPassword, verificationMethod } = resetPasswordDto;
        const normalizedPhone = phoneNumber || phone;
        const identifier = verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL ? email : normalizedPhone;
        const otpRecord = await this.prisma.otp.findFirst({
            where: {
                identifier,
                otp,
                type: client_1.OtpType.PASSWORD_RESET,
                used: false,
                expiresAt: { gt: new Date() },
            },
        });
        if (!otpRecord) {
            throw new common_1.BadRequestException('Invalid or expired reset code');
        }
        const user = await this.findUserByIdentifier(identifier, verificationMethod);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await Promise.all([
            this.prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            }),
            this.prisma.otp.update({
                where: { id: otpRecord.id },
                data: { used: true },
            }),
        ]);
        return { message: 'Password reset successfully' };
    }
    async resendOtp(resendOtpDto) {
        const { identifier, verificationMethod } = resendOtpDto;
        const user = await this.findUserByIdentifier(identifier, verificationMethod);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const otp = this.generateOTP();
        await this.createOTP(identifier, otp, client_1.OtpType.SIGNUP, verificationMethod);
        const sent = await this.sendOTP(identifier, otp, verificationMethod);
        if (!sent) {
            if (verificationMethod === phone_auth_dto_1.VerificationMethod.PHONE) {
                throw new common_1.BadRequestException('Failed to resend SMS verification code. Please try email verification instead.');
            }
            else {
                throw new common_1.BadRequestException('Failed to resend verification code');
            }
        }
        const method = verificationMethod === phone_auth_dto_1.VerificationMethod.EMAIL ? 'email' : 'phone';
        return { message: `OTP resent to ${method}` };
    }
    async findUserByIdentifier(identifier, method) {
        if (method === phone_auth_dto_1.VerificationMethod.EMAIL) {
            return this.prisma.user.findUnique({ where: { email: identifier } });
        }
        else {
            return this.prisma.user.findUnique({ where: { phoneNumber: identifier } });
        }
    }
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async createOTP(identifier, otp, type, method) {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        const otpData = {
            identifier,
            otp,
            type,
            expiresAt,
        };
        if (method === phone_auth_dto_1.VerificationMethod.EMAIL) {
            otpData.email = identifier;
        }
        else {
            otpData.phoneNumber = identifier;
        }
        return this.prisma.otp.create({ data: otpData });
    }
    async sendOTP(identifier, otp, method) {
        if (method === phone_auth_dto_1.VerificationMethod.EMAIL) {
            return this.emailService.sendOTP(identifier, otp);
        }
        else {
            return this.twilioService.sendOTP(identifier, otp);
        }
    }
    async sendPasswordResetOTP(identifier, otp, method) {
        if (method === phone_auth_dto_1.VerificationMethod.EMAIL) {
            return this.emailService.sendPasswordResetOTP(identifier, otp);
        }
        else {
            return this.twilioService.sendPasswordResetOTP(identifier, otp);
        }
    }
};
exports.UnifiedAuthService = UnifiedAuthService;
exports.UnifiedAuthService = UnifiedAuthService = UnifiedAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService,
        twilio_service_1.TwilioService])
], UnifiedAuthService);
//# sourceMappingURL=unified-auth.service.js.map