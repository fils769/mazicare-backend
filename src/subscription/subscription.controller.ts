import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionService } from './subscription.service';
import { RenewSubscriptionDto } from './dto/subscription.dto';

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) { }

  @Get()
  async getSubscription(@Request() req) {
    return this.subscriptionService.getSubscription(req.user.userId);
  }

  @Post('renew')
  async renewSubscription(@Request() req, @Body() renewData: RenewSubscriptionDto) {
    return this.subscriptionService.renewSubscription(req.user.userId, renewData);
  }

  @Get('plans')
  async getPlans() {
    return this.subscriptionService.getPlans();
  }

  @Post('cancel')
  async cancelSubscription(@Request() req) {
    return this.subscriptionService.cancelSubscription(req.user.userId);
  }
}