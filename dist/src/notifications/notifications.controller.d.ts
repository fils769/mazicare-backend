import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/notification.dto';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: string | null;
        read: boolean;
    }[]>;
    markAsRead(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: string | null;
        read: boolean;
    }>;
    createNotification(req: any, notificationData: CreateNotificationDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        type: string | null;
        read: boolean;
    }>;
}
