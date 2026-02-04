import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { VivaService } from './viva.service';

@Controller('viva-test')
export class VivaTestController {
  constructor(private vivaService: VivaService) {}

  @Post('create-order')
  async createTestOrder(@Body() body: { userId: string; planId: string }) {
    return this.vivaService.createOrder(body.userId, body.planId);
  }

  @Post('verify/:orderCode/:transactionId')
  async verifyPayment(
    @Param('orderCode') orderCode: string,
    @Param('transactionId') transactionId: string,
  ) {
    return this.vivaService.verifyAndActivate(BigInt(orderCode), transactionId);
  }

  @Post('cancel/:userId')
  async cancelSubscription(@Param('userId') userId: string) {
    return this.vivaService.cancelSubscription(userId);
  }
}