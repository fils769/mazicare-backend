import { Request, Response } from 'express';
import { VivaService } from 'src/viva/viva.service';
export declare class VivaWebhookController {
    private readonly vivaService;
    constructor(vivaService: VivaService);
    handleWebhook(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
