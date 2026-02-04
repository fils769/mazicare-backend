export declare const ActivityEvents: {
    readonly FAMILY_ELDER_CREATED: "family.elder.created";
    readonly FAMILY_ELDER_DELETED: "family.elder.deleted";
    readonly SCHEDULE_ITEM_COMPLETED: "schedule.item.completed";
    readonly SCHEDULE_COMPLETED: "schedule.completed";
    readonly SUBSCRIPTION_RENEWED: "subscription.renewed";
    readonly EVENT_VIEWED: "event.viewed";
    readonly DEAL_VIEWED: "deal.viewed";
    readonly DEAL_CLAIMED: "deal.claimed";
    readonly PAYMENT_SUCCEEDED: "payment.succeeded";
};
export type ActivityEventKey = keyof typeof ActivityEvents;
export type ActivityEventName = (typeof ActivityEvents)[ActivityEventKey];
export interface ElderActivityEvent {
    userId?: string;
    actorRole?: string;
    elderId: string;
    elderName?: string;
    familyId?: string;
    metadata?: Record<string, unknown>;
}
export interface ScheduleItemCompletedEvent {
    userId?: string;
    actorRole?: string;
    scheduleItemId: string;
    scheduleId: string;
    elderId: string;
    title?: string;
    metadata?: Record<string, unknown>;
}
export interface ScheduleCompletedEvent {
    userId?: string;
    actorRole?: string;
    scheduleId: string;
    elderId: string;
    metadata?: Record<string, unknown>;
}
export interface SubscriptionActivityEvent {
    userId?: string;
    actorRole?: string;
    subscriptionId: string;
    planId: string;
    planName?: string;
    event: 'NEW' | 'RENEWED';
    metadata?: Record<string, unknown>;
}
export interface EventViewedActivityEvent {
    userId?: string;
    actorRole?: string;
    eventId: string;
    metadata?: Record<string, unknown>;
}
export interface DealActivityEvent {
    userId?: string;
    actorRole?: string;
    dealId: string;
    metadata?: Record<string, unknown>;
}
export interface PaymentSucceededEvent {
    userId?: string;
    actorRole?: string;
    transactionId: string;
    paymentType: string;
    amount: number;
    caregiverId?: string;
    metadata?: Record<string, unknown>;
}
