import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../activity/activity-log.service';
import { ActivityEvents } from '../activity/activity.events';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { GetDealsQueryDto } from './dto/get-deals-query.dto';

@Injectable()
export class DealsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async create(createDealDto: CreateDealDto, createdBy?: string) {
    const deal = await this.prisma.deal.create({
      data: {
        ...createDealDto,
        createdBy,
      },
    });

    return deal;
  }

  async findAll(query: GetDealsQueryDto) {
    const { category, region, isActive, limit = 50, offset = 0 } = query;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (region) {
      where.region = region;
    }

    if (isActive !== undefined) {
      where.endsAt = isActive ? { gte: new Date() } : { lt: new Date() };
    }

    const [deals, total] = await Promise.all([
      this.prisma.deal.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { claims: true },
          },
        },
      }),
      this.prisma.deal.count({ where }),
    ]);

    return {
      deals: deals.map((deal) => ({
        ...deal,
        claimsCount: deal._count.claims,
        _count: undefined,
      })),
      total,
      limit,
      offset,
    };
  }

  async findOne(id: string, userId?: string) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: {
        _count: {
          select: { claims: true },
        },
      },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    let isClaimed = false;
    if (userId) {
      const claim = await this.prisma.dealClaim.findUnique({
        where: {
          dealId_userId: {
            dealId: id,
            userId,
          },
        },
      });
      isClaimed = !!claim;

      // Log deal view
      await this.activityLogService.logEvent({
        userId,
        category: 'FEATURE_USAGE',
        eventType: ActivityEvents.DEAL_VIEWED,
        entityType: 'deal',
        entityId: id,
        metadata: {
          dealTitle: deal.title,
          dealCategory: deal.category,
        },
      });
    }

    return {
      ...deal,
      claimsCount: deal._count.claims,
      isClaimed,
      _count: undefined,
    };
  }

  async update(id: string, updateDealDto: UpdateDealDto) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    return this.prisma.deal.update({
      where: { id },
      data: updateDealDto,
    });
  }

  async remove(id: string) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    await this.prisma.deal.delete({
      where: { id },
    });

    return { success: true, message: 'Deal deleted successfully' };
  }

  async claimDeal(dealId: string, userId: string, userRole?: string) {
    const deal = await this.prisma.deal.findUnique({
      where: { id: dealId },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    // Check if deal is active
    const now = new Date();
    if (deal.startsAt && deal.startsAt > now) {
      throw new BadRequestException('Deal has not started yet');
    }

    if (deal.endsAt && deal.endsAt < now) {
      throw new BadRequestException('Deal has expired');
    }

    // Check if already claimed
    const existingClaim = await this.prisma.dealClaim.findUnique({
      where: {
        dealId_userId: {
          dealId,
          userId,
        },
      },
    });

    if (existingClaim) {
      throw new ConflictException('You have already claimed this deal');
    }

    const claim = await this.prisma.dealClaim.create({
      data: {
        dealId,
        userId,
      },
      include: {
        deal: true,
      },
    });

    // Log deal claim
    await this.activityLogService.logEvent({
      userId,
      actorRole: userRole,
      category: 'FEATURE_USAGE',
      eventType: ActivityEvents.DEAL_CLAIMED,
      entityType: 'deal',
      entityId: dealId,
      metadata: {
        dealTitle: deal.title,
        dealCategory: deal.category,
        claimId: claim.id,
      },
    });

    return claim;
  }

  async getUserClaims(userId: string) {
    const claims = await this.prisma.dealClaim.findMany({
      where: { userId },
      include: {
        deal: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return claims;
  }

  async getDealClaims(dealId: string) {
    const deal = await this.prisma.deal.findUnique({
      where: { id: dealId },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    const claims = await this.prisma.dealClaim.findMany({
      where: { dealId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            caregiver: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            family: {
              select: {
                familyName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      deal,
      claims: claims.map((claim) => ({
        id: claim.id,
        userId: claim.userId,
        claimedAt: claim.createdAt,
        user: {
          email: claim.user.email,
          role: claim.user.role,
          name:
            claim.user.caregiver
              ? `${claim.user.caregiver.firstName} ${claim.user.caregiver.lastName}`
              : claim.user.family?.familyName || claim.user.email,
        },
      })),
      totalClaims: claims.length,
    };
  }
}
