import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnifiedAuthController } from './unified-auth.controller';
import { UnifiedAuthService } from './unified-auth.service';
import { TwilioService } from './twilio.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, UnifiedAuthController],
  providers: [
    AuthService,
    UnifiedAuthService,
    TwilioService,
    EmailService,
    JwtStrategy,
    PrismaService,
  ],
  exports: [AuthService, UnifiedAuthService],
})
export class AuthModule {}
