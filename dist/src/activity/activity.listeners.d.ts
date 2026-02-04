import { ActivityLogService } from './activity-log.service';
import type { ElderActivityEvent, ScheduleCompletedEvent, ScheduleItemCompletedEvent, SubscriptionActivityEvent, PaymentSucceededEvent } from './activity.events';
export declare class ActivityListeners {
    private readonly activityLogService;
    private readonly logger;
    constructor(activityLogService: ActivityLogService);
    handleElderCreated(payload: ElderActivityEvent): Promise<void>;
    handleElderDeleted(payload: ElderActivityEvent): Promise<void>;
    handleScheduleItemCompleted(payload: ScheduleItemCompletedEvent): Promise<void>;
    handleScheduleCompleted(payload: ScheduleCompletedEvent): Promise<void>;
    handleSubscriptionRenewed(payload: SubscriptionActivityEvent): Promise<void>;
    handlePaymentSucceeded(payload: PaymentSucceededEvent): Promise<void>;
}
