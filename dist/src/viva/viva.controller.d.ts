import { VivaService } from './viva.service';
export declare class VivaController {
    private vivaService;
    constructor(vivaService: VivaService);
    createOrder(req: any, body: {
        planId: string;
    }): Promise<{
        checkoutUrl: string;
    }>;
    cancelSubscription(req: any): Promise<{
        message: string;
    }>;
}
