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
var ActivityListeners_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityListeners = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const activity_log_service_1 = require("./activity-log.service");
const activity_events_1 = require("./activity.events");
let ActivityListeners = ActivityListeners_1 = class ActivityListeners {
    activityLogService;
    logger = new common_1.Logger(ActivityListeners_1.name);
    constructor(activityLogService) {
        this.activityLogService = activityLogService;
    }
    async handleElderCreated(payload) {
        try {
            await this.activityLogService.logEvent({
                userId: payload.userId,
                actorRole: payload.actorRole,
                category: activity_log_service_1.ACTIVITY_CATEGORY.USER_ACTIVITY,
                eventType: activity_events_1.ActivityEvents.FAMILY_ELDER_CREATED,
                entityType: 'ELDER',
                entityId: payload.elderId,
                metadata: {
                    elderName: payload.elderName,
                    familyId: payload.familyId,
                    ...payload.metadata,
                },
            });
        }
        catch (error) {
            this.logger.error('Failed to log elder creation activity', error instanceof Error ? error.stack : error);
        }
    }
    async handleElderDeleted(payload) {
        try {
            await this.activityLogService.logEvent({
                userId: payload.userId,
                actorRole: payload.actorRole,
                category: activity_log_service_1.ACTIVITY_CATEGORY.USER_ACTIVITY,
                eventType: activity_events_1.ActivityEvents.FAMILY_ELDER_DELETED,
                entityType: 'ELDER',
                entityId: payload.elderId,
                metadata: {
                    elderName: payload.elderName,
                    familyId: payload.familyId,
                    ...payload.metadata,
                },
            });
        }
        catch (error) {
            this.logger.error('Failed to log elder deletion activity', error instanceof Error ? error.stack : error);
        }
    }
    async handleScheduleItemCompleted(payload) {
        try {
            await this.activityLogService.logEvent({
                userId: payload.userId,
                actorRole: payload.actorRole,
                category: activity_log_service_1.ACTIVITY_CATEGORY.FEATURE_USAGE,
                eventType: activity_events_1.ActivityEvents.SCHEDULE_ITEM_COMPLETED,
                entityType: 'SCHEDULE_ITEM',
                entityId: payload.scheduleItemId,
                metadata: {
                    scheduleId: payload.scheduleId,
                    elderId: payload.elderId,
                    title: payload.title,
                    ...payload.metadata,
                },
            });
        }
        catch (error) {
            this.logger.error('Failed to log schedule item completion', error instanceof Error ? error.stack : error);
        }
    }
    async handleScheduleCompleted(payload) {
        try {
            await this.activityLogService.logEvent({
                userId: payload.userId,
                actorRole: payload.actorRole,
                category: activity_log_service_1.ACTIVITY_CATEGORY.FEATURE_USAGE,
                eventType: activity_events_1.ActivityEvents.SCHEDULE_COMPLETED,
                entityType: 'SCHEDULE',
                entityId: payload.scheduleId,
                metadata: {
                    elderId: payload.elderId,
                    ...payload.metadata,
                },
            });
        }
        catch (error) {
            this.logger.error('Failed to log schedule completion', error instanceof Error ? error.stack : error);
        }
    }
    async handleSubscriptionRenewed(payload) {
        try {
            await this.activityLogService.logEvent({
                userId: payload.userId,
                actorRole: payload.actorRole,
                category: activity_log_service_1.ACTIVITY_CATEGORY.FEATURE_USAGE,
                eventType: activity_events_1.ActivityEvents.SUBSCRIPTION_RENEWED,
                entityType: 'SUBSCRIPTION',
                entityId: payload.subscriptionId,
                metadata: {
                    planId: payload.planId,
                    planName: payload.planName,
                    event: payload.event,
                    ...payload.metadata,
                },
            });
        }
        catch (error) {
            this.logger.error('Failed to log subscription renewal activity', error instanceof Error ? error.stack : error);
        }
    }
    async handlePaymentSucceeded(payload) {
        try {
            await this.activityLogService.logEvent({
                userId: payload.userId,
                actorRole: payload.actorRole,
                category: activity_log_service_1.ACTIVITY_CATEGORY.FEATURE_USAGE,
                eventType: activity_events_1.ActivityEvents.PAYMENT_SUCCEEDED,
                entityType: 'PAYMENT_TRANSACTION',
                entityId: payload.transactionId,
                metadata: {
                    paymentType: payload.paymentType,
                    amount: payload.amount,
                    caregiverId: payload.caregiverId,
                    ...payload.metadata,
                },
            });
        }
        catch (error) {
            this.logger.error('Failed to log payment success activity', error instanceof Error ? error.stack : error);
        }
    }
};
exports.ActivityListeners = ActivityListeners;
__decorate([
    (0, event_emitter_1.OnEvent)(activity_events_1.ActivityEvents.FAMILY_ELDER_CREATED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ActivityListeners.prototype, "handleElderCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)(activity_events_1.ActivityEvents.FAMILY_ELDER_DELETED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ActivityListeners.prototype, "handleElderDeleted", null);
__decorate([
    (0, event_emitter_1.OnEvent)(activity_events_1.ActivityEvents.SCHEDULE_ITEM_COMPLETED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ActivityListeners.prototype, "handleScheduleItemCompleted", null);
__decorate([
    (0, event_emitter_1.OnEvent)(activity_events_1.ActivityEvents.SCHEDULE_COMPLETED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ActivityListeners.prototype, "handleScheduleCompleted", null);
__decorate([
    (0, event_emitter_1.OnEvent)(activity_events_1.ActivityEvents.SUBSCRIPTION_RENEWED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ActivityListeners.prototype, "handleSubscriptionRenewed", null);
__decorate([
    (0, event_emitter_1.OnEvent)(activity_events_1.ActivityEvents.PAYMENT_SUCCEEDED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ActivityListeners.prototype, "handlePaymentSucceeded", null);
exports.ActivityListeners = ActivityListeners = ActivityListeners_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [activity_log_service_1.ActivityLogService])
], ActivityListeners);
//# sourceMappingURL=activity.listeners.js.map