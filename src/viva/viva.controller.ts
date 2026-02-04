import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { VivaService } from './viva.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('viva')
@UseGuards(JwtAuthGuard)
export class VivaController {
  constructor(private vivaService: VivaService) {}

  @Post('create-order')
  async createOrder(
    @Req() req: any,
    @Body() body: { planId: string },
  ) {
    return this.vivaService.createOrder(req.user.userId, body.planId);
  }

  @Post('cancel-subscription')
  async cancelSubscription(@Req() req: any) {
    return this.vivaService.cancelSubscription(req.user.userId);
  }
}