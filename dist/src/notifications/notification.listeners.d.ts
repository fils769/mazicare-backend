import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
type SubscriptionRenewedEvent = {
    userId: string;
    planName: string;
    subscription: {
        endDate: Date;
        [key: string]: unknown;
    };
};
type MessageReceivedEvent = {
    message: {
        id: string;
        conversationId: string;
        senderId: string;
        recipientId: string;
        content: string;
        createdAt: Date;
        sender?: {
            id: string;
            email: string;
        };
        recipient?: {
            id: string;
            email: string;
        };
    };
    conversation: {
        id: string;
        participants: string[];
        lastMessage: string | null;
        lastMessageTime: Date | null;
    };
};
export declare class NotificationListeners {
    private readonly notificationsService;
    private readonly notificationsGateway;
    private readonly logger;
    constructor(notificationsService: NotificationsService, notificationsGateway: NotificationsGateway);
    handleSubscriptionRenewed(event: SubscriptionRenewedEvent): Promise<void>;
    handleMessageReceived(event: MessageReceivedEvent): Promise<void>;
}
export {};
