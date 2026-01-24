import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    return this.prisma.notification.update({
      where: {
        id: notificationId,
        userId, // Ensure user can only update their own notifications
      },
      data: { read: true },
    });
  }

  async createNotification(
    userId: string,
    notificationData: CreateNotificationDto,
  ) {
    return this.prisma.notification.create({
      data: {
        userId: notificationData.recipientId || userId,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
      },
    });
  }
}
