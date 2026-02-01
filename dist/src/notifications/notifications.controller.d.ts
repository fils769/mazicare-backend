import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/notification.dto';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(req: any): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: string | null;
        read: boolean;
        createdAt: Date;
    }[]>;
    markAllAsRead(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAsRead(req: any, id: string): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: string | null;
        read: boolean;
        createdAt: Date;
    }>;
    createNotification(req: any, notificationData: CreateNotificationDto): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: string | null;
        read: boolean;
        createdAt: Date;
    }>;
    deleteAllNotifications(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteNotification(req: any, id: string): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: string | null;
        read: boolean;
        createdAt: Date;
    }>;
}
