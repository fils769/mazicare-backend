import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { CreateSubscriptionCheckoutDto } from './dto/create-subscription-checkout.dto';
import { ConfirmCheckoutDto } from './dto/confirm-subscription.dto';
import { CreateCaregiverCheckoutDto } from './dto/create-payout-intent.dto';
interface AuthContext {
    userId: string;
    email?: string;
    role?: string;
}
export declare class PaymentsService {
    private readonly configService;
    private readonly prisma;
    private readonly subscriptionService;
    private readonly eventEmitter;
    private readonly stripe;
    constructor(configService: ConfigService, prisma: PrismaService, subscriptionService: SubscriptionService, eventEmitter: EventEmitter2);
    createSubscriptionCheckout({ userId, email }: AuthContext, dto: CreateSubscriptionCheckoutDto): Promise<{
        sessionId: string;
        checkoutUrl: string | null;
    }>;
    confirmSubscriptionCheckout({ userId, role }: AuthContext, dto: ConfirmCheckoutDto): Promise<{
        success: boolean;
    }>;
    createCaregiverCheckout({ userId, email, role }: AuthContext, dto: CreateCaregiverCheckoutDto): Promise<{
        sessionId: string;
        checkoutUrl: string | null;
    }>;
    confirmCaregiverCheckout({ userId, role }: AuthContext, dto: ConfirmCheckoutDto): Promise<{
        success: boolean;
    }>;
    private toMinorCurrency;
    private ensureCheckoutRedirect;
    private caregiverName;
    private mergeMetadata;
}
export {};
