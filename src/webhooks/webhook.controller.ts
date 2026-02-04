// // src/webhooks/viva-webhook.controller.ts
// import { Controller, Get, Post, Req, Res } from '@nestjs/common';
// import { Request, Response } from 'express';

// @Controller('webhooks/vivawallet')
// export class VivaWebhookController {

//   // 👇 THIS IS WHAT VIVA CALLS WHEN YOU CLICK "VERIFY"
//   @Get()
//   verifyWebhook(@Res() res: Response) {
//     return res.status(200).json({
//       Key: process.env.VIVA_WEBHOOK_VERIFICATION_KEY,
//     });
//   }

//   // 👇 THIS IS WHERE REAL EVENTS COME
//   @Post()
//   async handleWebhook(@Req() req: Request, @Res() res: Response) {
//     const event = req.body;

//     console.log('🔔 Viva Webhook Event:', event);

//     switch (event.EventTypeId) {
//       case 1796: // Transaction Payment Created
//         console.log('✅ Payment completed');
//         break;

//       default:
//         console.log('ℹ️ Unhandled event:', event.EventTypeId);
//     }

//     return res.status(200).json({ received: true });
//   }
// }

import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { VivaService } from 'src/viva/viva.service';

@Controller('webhooks/vivawallet')
export class VivaWebhookController {
  constructor(private readonly vivaService: VivaService) {}

  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const event = req.body;
    console.log('🔔 Viva Webhook Event:', event);

    try {
      const data = event.EventData;

      switch (event.EventTypeId) {
        case 1796: // Transaction Payment Created
          console.log('✅ Payment completed');
          const orderCode = BigInt(data.OrderCode);
          const transactionId = data.TransactionId;

          await this.vivaService.verifyAndActivate(orderCode, transactionId);
          console.log('💾 PaymentOrder and Subscription updated');
          break;

        case 1800: // Subscription Cancelled / User requested cancellation
          console.log('⚠️ Subscription cancellation event');
          if (data.UserId) {
            await this.vivaService.cancelSubscription(data.UserId);
            console.log('💾 Subscription marked as CANCELLED');
          }
          break;

        default:
          console.log('ℹ️ Unhandled event:', event.EventTypeId);
      }

      return res.status(200).json({ received: true });
    } catch (err) {
      console.error('❌ Error handling Viva webhook:', err);
      return res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
}
