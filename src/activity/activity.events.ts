export const ActivityEvents = {
  FAMILY_ELDER_CREATED: 'family.elder.created',
  FAMILY_ELDER_DELETED: 'family.elder.deleted',
  SCHEDULE_ITEM_COMPLETED: 'schedule.item.completed',
  SCHEDULE_COMPLETED: 'schedule.completed',
  SUBSCRIPTION_RENEWED: 'subscription.renewed',
  EVENT_VIEWED: 'event.viewed',
  DEAL_VIEWED: 'deal.viewed',
  DEAL_CLAIMED: 'deal.claimed',
  PAYMENT_SUCCEEDED: 'payment.succeeded',
} as const;

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
