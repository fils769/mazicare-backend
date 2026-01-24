import { PaymentsService } from './payments.service';
import { CreateSubscriptionCheckoutDto } from './dto/create-subscription-checkout.dto';
import { ConfirmCheckoutDto } from './dto/confirm-subscription.dto';
import { CreateCaregiverCheckoutDto } from './dto/create-payout-intent.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createSubscriptionCheckout(req: any, dto: CreateSubscriptionCheckoutDto): Promise<{
        sessionId: string;
        checkoutUrl: string | null;
    }>;
    confirmSubscriptionCheckout(req: any, dto: ConfirmCheckoutDto): Promise<{
        success: boolean;
    }>;
    createCaregiverCheckout(req: any, dto: CreateCaregiverCheckoutDto): Promise<{
        sessionId: string;
        checkoutUrl: string | null;
    }>;
    confirmCaregiverCheckout(req: any, dto: ConfirmCheckoutDto): Promise<{
        success: boolean;
    }>;
    private getContext;
}
