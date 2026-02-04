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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const nodemailer = __importStar(require("nodemailer"));
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    transporter;
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: this.configService.get('SMTP_PORT'),
            secure: false,
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
    }
    async signup(signupDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: signupDto.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('User already exists');
        }
        const existingOtp = await this.prisma.otp.findFirst({
            where: {
                email: signupDto.email,
                type: client_1.OtpType.VERIFICATION,
                used: false,
                expiresAt: { gt: new Date() },
            },
        });
        if (existingOtp) {
            return { message: 'OTP was already sent. Please check your inbox.' };
        }
        const user = await this.prisma.user.create({
            data: {
                email: signupDto.email,
                role: signupDto.role,
            },
        });
        await this.prisma.otp.deleteMany({
            where: {
                email: signupDto.email,
                type: client_1.OtpType.VERIFICATION,
            },
        });
        const otp = this.generateOtp();
        await this.prisma.otp.create({
            data: {
                email: signupDto.email,
                identifier: signupDto.email,
                otp,
                type: client_1.OtpType.VERIFICATION,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });
        await this.sendOtpEmail(signupDto.email, otp);
        return { message: 'OTP sent to email' };
    }
    async verifyOtp(verifyOtpDto) {
        const otpRecord = await this.prisma.otp.findFirst({
            where: {
                email: verifyOtpDto.email,
                otp: verifyOtpDto.otp,
                type: client_1.OtpType.VERIFICATION,
                used: false,
                expiresAt: { gt: new Date() },
            },
        });
        if (!otpRecord) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        await this.prisma.otp.delete({
            where: { id: otpRecord.id },
        });
        await this.prisma.user.update({
            where: { email: verifyOtpDto.email },
            data: { isVerified: true },
        });
        return { message: 'Email verified successfully' };
    }
    async verifyForgotPasswordOtp(verifyOtpDto) {
        const otpRecord = await this.prisma.otp.findFirst({
            where: {
                email: verifyOtpDto.email,
                otp: verifyOtpDto.otp,
                type: client_1.OtpType.PASSWORD_RESET,
                used: false,
                expiresAt: { gt: new Date() },
            },
        });
        if (!otpRecord) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        return {
            message: 'OTP verified successfully. You can now reset your password.',
        };
    }
    async createPassword(createPasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: createPasswordDto.email },
        });
        if (!user || !user.isVerified) {
            throw new common_1.BadRequestException('User not found or not verified');
        }
        const hashedPassword = await bcrypt.hash(createPasswordDto.password, 10);
        await this.prisma.user.update({
            where: { email: createPasswordDto.email },
            data: { password: hashedPassword },
        });
        const payload = { email: user.email, sub: user.id, role: user.role };
        const token = this.jwtService.sign(payload);
        return {
            access_token: token,
            user: { id: user.id, email: user.email, role: user.role },
        };
    }
    async login(loginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
        });
        if (!user || !user.password || !user.isVerified) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { email: user.email, sub: user.id, role: user.role };
        const expiresIn = loginDto.rememberMe ? '30d' : '1d';
        const token = this.jwtService.sign(payload, { expiresIn });
        return {
            access_token: token,
            user: { id: user.id, email: user.email, role: user.role },
        };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const existingOtp = await this.prisma.otp.findFirst({
            where: {
                email,
                type: client_1.OtpType.PASSWORD_RESET,
                used: false,
                expiresAt: { gt: new Date() },
            },
        });
        if (existingOtp) {
            return {
                message: 'Password reset OTP was already sent. Please check your inbox.',
            };
        }
        await this.prisma.otp.deleteMany({
            where: {
                email,
                type: client_1.OtpType.PASSWORD_RESET,
            },
        });
        const otp = this.generateOtp();
        await this.prisma.otp.create({
            data: {
                email,
                identifier: email,
                otp,
                type: client_1.OtpType.PASSWORD_RESET,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });
        await this.sendOtpEmail(email, otp);
        return { message: 'Password reset OTP sent to email' };
    }
    async resetPassword(resetPasswordDto) {
        const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);
        const user = await this.prisma.user.update({
            where: { email: resetPasswordDto.email },
            data: { password: hashedPassword },
        });
        const payload = { email: user.email, sub: user.id, role: user.role };
        const token = this.jwtService.sign(payload);
        return {
            access_token: token,
            user: { id: user.id, email: user.email, role: user.role },
        };
    }
    async logout() {
        return { message: 'Logged out successfully' };
    }
    async resendOtp(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        await this.prisma.otp.deleteMany({
            where: {
                email,
                type: client_1.OtpType.VERIFICATION,
            },
        });
        const otp = this.generateOtp();
        await this.prisma.otp.create({
            data: {
                email,
                identifier: email,
                otp,
                type: client_1.OtpType.VERIFICATION,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });
        await this.sendOtpEmail(email, otp);
        return { message: 'OTP resent to email' };
    }
    async resendForgotPasswordOtp(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        await this.prisma.otp.deleteMany({
            where: {
                email,
                type: client_1.OtpType.PASSWORD_RESET,
            },
        });
        const otp = this.generateOtp();
        await this.prisma.otp.create({
            data: {
                email,
                identifier: email,
                otp,
                type: client_1.OtpType.PASSWORD_RESET,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });
        await this.sendOtpEmail(email, otp);
        return { message: 'Password reset OTP resent to email' };
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async sendOtpEmail(email, otp) {
        const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">MaziCare</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Secure Authentication</p>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 24px;">Your Verification Code</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Please use the following code to complete your verification:
            </p>
            <div style="background-color: #f8fafc; border: 2px dashed #1e3a8a; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
              <div style="font-size: 36px; font-weight: bold; color: #1e3a8a; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
              This code will expire in <strong>10 minutes</strong>. If you didn't request this code, please ignore this email.
            </p>
          </div>
          <div style="background-color: #f8fafc; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
              © 2024 MaziCare. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
        const mailOptions = {
            from: this.configService.get('SMTP_FROM'),
            to: email,
            subject: 'Your MaziCare Verification Code',
            text: `Your OTP code is: ${otp}. This code will expire in 10 minutes.`,
            html: htmlTemplate,
        };
        await this.transporter.sendMail(mailOptions);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map