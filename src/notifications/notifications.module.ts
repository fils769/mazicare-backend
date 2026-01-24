import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationListeners } from './notification.listeners';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService, NotificationListeners],
})
export class NotificationsModule {}
