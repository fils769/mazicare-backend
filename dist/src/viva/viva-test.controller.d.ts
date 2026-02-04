import { VivaService } from './viva.service';
export declare class VivaTestController {
    private vivaService;
    constructor(vivaService: VivaService);
    createTestOrder(body: {
        userId: string;
        planId: string;
    }): Promise<{
        checkoutUrl: string;
    }>;
    verifyPayment(orderCode: string, transactionId: string): Promise<void>;
    cancelSubscription(userId: string): Promise<{
        message: string;
    }>;
}
