import { Controller, Post, Get, UseGuards, NotFoundException, Req } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(
    private service: SubscriptionService,
    private prisma: PrismaService
  ) {}

  @Get('plans')
  async getPlans(@Req() req: any) {
    const userRole = req.user.role;
    
    return this.prisma.subscriptionPlan.findMany({
      where: {
        role: userRole, 
      },
      select: {
        id: true,
        name: true,
        role: true,
        basePrice: true,
        vatRate: true,
        durationMonths: true,
        features: true,
      },
    });
  }
  

  @Get()
  async getSubscription(@Req() req: any) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId: req.user.userId },
      include: {
        plan: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException('No subscription found');
    }

    return {
      id: subscription.id,
      planId: subscription.planId,
      planName: subscription.plan.name,
      status: subscription.status.toLowerCase(),
      currentPeriodEnd: subscription.endDate.toISOString(),
      cancelAtPeriodEnd: !!subscription.cancelledAt,
    };
  }

  @Post('checkout')
  async checkout(@Req() req: any) {
    return this.service.startSubscription(req.user.userId);
  }

  @Get('me')
  async mySubscription(@Req() req: any) {
    return this.service.getSubscription(req.user.userId);
  }
}
