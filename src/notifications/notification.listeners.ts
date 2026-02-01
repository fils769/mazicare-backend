import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
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
    sender?: { id: string; email: string };
    recipient?: { id: string; email: string };
  };
  conversation: {
    id: string;
    participants: string[];
    lastMessage: string | null;
    lastMessageTime: Date | null;
  };
};

@Injectable()
export class NotificationListeners {
  private readonly logger = new Logger(NotificationListeners.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  @OnEvent('subscription.renewed')
  async handleSubscriptionRenewed(event: SubscriptionRenewedEvent) {
    try {
      const notification = await this.notificationsService.createNotification(event.userId, {
        recipientId: event.userId,
        title: 'Subscription Renewed',
        message: `Your ${event.planName} plan is active until ${new Date(event.subscription.endDate).toLocaleDateString()}.`,
        type: 'SUBSCRIPTION',
      });

      // Send real-time notification via WebSocket
      this.notificationsGateway.sendNotificationToUser(event.userId, notification);

      this.logger.log(`Subscription renewal notification sent to user ${event.userId}`);
    } catch (error) {
      this.logger.error(
        'Failed to create subscription renewal notification',
        error instanceof Error ? error.stack : error,
      );
    }
  }

  @OnEvent('messages.received')
  async handleMessageReceived(event: MessageReceivedEvent) {
    const { message } = event;

    if (!message || message.senderId === message.recipientId) {
      return;
    }

    try {
      const notification = await this.notificationsService.createNotification(message.recipientId, {
        recipientId: message.recipientId,
        title: `New message from ${message.sender?.email ?? 'a user'}`,
        message: message.content,
        type: 'MESSAGE',
      });

      // Send real-time notification via WebSocket
      this.notificationsGateway.sendNotificationToUser(message.recipientId, notification);

      this.logger.log(`Message notification sent to user ${message.recipientId}`);
    } catch (error) {
      this.logger.error(
        'Failed to create message notification',
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
