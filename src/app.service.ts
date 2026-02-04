// app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      message: 'Hello World!',
      service: 'Payment API',
      status: 'online',
      timestamp: new Date().toISOString(),
      endpoints: {
        webhook: 'POST /payment/webhook',
        createCheckout: 'POST /payment/create-checkout'
      }
    };
  }
}