"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const unified_auth_controller_1 = require("./unified-auth.controller");
const unified_auth_service_1 = require("./unified-auth.service");
const twilio_service_1 = require("./twilio.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '24h' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController, unified_auth_controller_1.UnifiedAuthController],
        providers: [
            auth_service_1.AuthService,
            unified_auth_service_1.UnifiedAuthService,
            twilio_service_1.TwilioService,
            email_service_1.EmailService,
            jwt_strategy_1.JwtStrategy,
            prisma_service_1.PrismaService,
        ],
        exports: [auth_service_1.AuthService, unified_auth_service_1.UnifiedAuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map