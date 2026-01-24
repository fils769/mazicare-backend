import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ActivityLogService, ACTIVITY_CATEGORY } from './activity-log.service';
import { ActivityEvents } from './activity.events';
import type {
  ElderActivityEvent,
  ScheduleCompletedEvent,
  ScheduleItemCompletedEvent,
  SubscriptionActivityEvent,
  PaymentSucceededEvent,
} from './activity.events';

@Injectable()
export class ActivityListeners {
  private readonly logger = new Logger(ActivityListeners.name);

  constructor(private readonly activityLogService: ActivityLogService) {}

  @OnEvent(ActivityEvents.FAMILY_ELDER_CREATED)
  async handleElderCreated(payload: ElderActivityEvent) {
    try {
      await this.activityLogService.logEvent({
        userId: payload.userId,
        actorRole: payload.actorRole,
        category: ACTIVITY_CATEGORY.USER_ACTIVITY,
        eventType: ActivityEvents.FAMILY_ELDER_CREATED,
        entityType: 'ELDER',
        entityId: payload.elderId,
        metadata: {
          elderName: payload.elderName,
          familyId: payload.familyId,
          ...payload.metadata,
        },
      });
    } catch (error) {
      this.logger.error(
        'Failed to log elder creation activity',
        error instanceof Error ? error.stack : error,
      );
    }
  }

  @OnEvent(ActivityEvents.FAMILY_ELDER_DELETED)
  async handleElderDeleted(payload: ElderActivityEvent) {
    try {
      await this.activityLogService.logEvent({
        userId: payload.userId,
        actorRole: payload.actorRole,
        category: ACTIVITY_CATEGORY.USER_ACTIVITY,
        eventType: ActivityEvents.FAMILY_ELDER_DELETED,
        entityType: 'ELDER',
        entityId: payload.elderId,
        metadata: {
          elderName: payload.elderName,
          familyId: payload.familyId,
          ...payload.metadata,
        },
      });
    } catch (error) {
      this.logger.error(
        'Failed to log elder deletion activity',
        error instanceof Error ? error.stack : error,
      );
    }
  }

  @OnEvent(ActivityEvents.SCHEDULE_ITEM_COMPLETED)
  async handleScheduleItemCompleted(payload: ScheduleItemCompletedEvent) {
    try {
      await this.activityLogService.logEvent({
        userId: payload.userId,
        actorRole: payload.actorRole,
        category: ACTIVITY_CATEGORY.FEATURE_USAGE,
        eventType: ActivityEvents.SCHEDULE_ITEM_COMPLETED,
        entityType: 'SCHEDULE_ITEM',
        entityId: payload.scheduleItemId,
        metadata: {
          scheduleId: payload.scheduleId,
          elderId: payload.elderId,
          title: payload.title,
          ...payload.metadata,
        },
      });
    } catch (error) {
      this.logger.error(
        'Failed to log schedule item completion',
        error instanceof Error ? error.stack : error,
      );
    }
  }

  @OnEvent(ActivityEvents.SCHEDULE_COMPLETED)
  async handleScheduleCompleted(payload: ScheduleCompletedEvent) {
    try {
      await this.activityLogService.logEvent({
        userId: payload.userId,
        actorRole: payload.actorRole,
        category: ACTIVITY_CATEGORY.FEATURE_USAGE,
        eventType: ActivityEvents.SCHEDULE_COMPLETED,
        entityType: 'SCHEDULE',
        entityId: payload.scheduleId,
        metadata: {
          elderId: payload.elderId,
          ...payload.metadata,
        },
      });
    } catch (error) {
      this.logger.error(
        'Failed to log schedule completion',
        error instanceof Error ? error.stack : error,
      );
    }
  }

  @OnEvent(ActivityEvents.SUBSCRIPTION_RENEWED)
  async handleSubscriptionRenewed(payload: SubscriptionActivityEvent) {
    try {
      await this.activityLogService.logEvent({
        userId: payload.userId,
        actorRole: payload.actorRole,
        category: ACTIVITY_CATEGORY.FEATURE_USAGE,
        eventType: ActivityEvents.SUBSCRIPTION_RENEWED,
        entityType: 'SUBSCRIPTION',
        entityId: payload.subscriptionId,
        metadata: {
          planId: payload.planId,
          planName: payload.planName,
          event: payload.event,
          ...payload.metadata,
        },
      });
    } catch (error) {
      this.logger.error(
        'Failed to log subscription renewal activity',
        error instanceof Error ? error.stack : error,
      );
    }
  }

  @OnEvent(ActivityEvents.PAYMENT_SUCCEEDED)
  async handlePaymentSucceeded(payload: PaymentSucceededEvent) {
    try {
      await this.activityLogService.logEvent({
        userId: payload.userId,
        actorRole: payload.actorRole,
        category: ACTIVITY_CATEGORY.FEATURE_USAGE,
        eventType: ActivityEvents.PAYMENT_SUCCEEDED,
        entityType: 'PAYMENT_TRANSACTION',
        entityId: payload.transactionId,
        metadata: {
          paymentType: payload.paymentType,
          amount: payload.amount,
          caregiverId: payload.caregiverId,
          ...payload.metadata,
        },
      });
    } catch (error) {
      this.logger.error(
        'Failed to log payment success activity',
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
