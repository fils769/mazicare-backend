import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationListeners } from './notification.listeners';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback-secret',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    PrismaService,
    NotificationListeners,
    NotificationsGateway,
  ],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
