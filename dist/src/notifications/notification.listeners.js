"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationListeners_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationListeners = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const notifications_service_1 = require("./notifications.service");
const notifications_gateway_1 = require("./notifications.gateway");
let NotificationListeners = NotificationListeners_1 = class NotificationListeners {
    notificationsService;
    notificationsGateway;
    logger = new common_1.Logger(NotificationListeners_1.name);
    constructor(notificationsService, notificationsGateway) {
        this.notificationsService = notificationsService;
        this.notificationsGateway = notificationsGateway;
    }
    async handleSubscriptionRenewed(event) {
        try {
            const notification = await this.notificationsService.createNotification(event.userId, {
                recipientId: event.userId,
                title: 'Subscription Renewed',
                message: `Your ${event.planName} plan is active until ${new Date(event.subscription.endDate).toLocaleDateString()}.`,
                type: 'SUBSCRIPTION',
            });
            this.notificationsGateway.sendNotificationToUser(event.userId, notification);
            this.logger.log(`Subscription renewal notification sent to user ${event.userId}`);
        }
        catch (error) {
            this.logger.error('Failed to create subscription renewal notification', error instanceof Error ? error.stack : error);
        }
    }
    async handleMessageReceived(event) {
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
            this.notificationsGateway.sendNotificationToUser(message.recipientId, notification);
            this.logger.log(`Message notification sent to user ${message.recipientId}`);
        }
        catch (error) {
            this.logger.error('Failed to create message notification', error instanceof Error ? error.stack : error);
        }
    }
};
exports.NotificationListeners = NotificationListeners;
__decorate([
    (0, event_emitter_1.OnEvent)('subscription.renewed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationListeners.prototype, "handleSubscriptionRenewed", null);
__decorate([
    (0, event_emitter_1.OnEvent)('messages.received'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationListeners.prototype, "handleMessageReceived", null);
exports.NotificationListeners = NotificationListeners = NotificationListeners_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        notifications_gateway_1.NotificationsGateway])
], NotificationListeners);
//# sourceMappingURL=notification.listeners.js.map