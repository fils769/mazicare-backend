import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/notification.dto';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getNotifications(userId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: string | null;
        read: boolean;
        createdAt: Date;
    }[]>;
    markAsRead(userId: string, notificationId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: string | null;
        read: boolean;
        createdAt: Date;
    }>;
    createNotification(userId: string, notificationData: CreateNotificationDto): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: string | null;
        read: boolean;
        createdAt: Date;
    }>;
    deleteNotification(userId: string, notificationId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: string | null;
        read: boolean;
        createdAt: Date;
    }>;
    deleteAllNotifications(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
