import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ActivityCategory,
  ActivityLog,
  AccountStatus,
  Gender,
} from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../activity/activity-log.service';
import { ActivityEvents } from '../activity/activity.events';
import { AdminActivityQueryDto } from './dto/admin-activity-query.dto';
import { AdminUpdateElderDto } from './dto/update-elder.dto';
import { UpdateCaregiverStatusDto } from './dto/update-caregiver-status.dto';
import {
  AdminProfileQueryDto,
  AdminProfileType,
} from './dto/admin-profile-query.dto';

const MS_IN_DAY = 1000 * 60 * 60 * 24;

@Injectable()
export class AdminService {
  private readonly stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogService: ActivityLogService,
    private readonly configService: ConfigService,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-12-15.clover',
    });
  }

  async getActivityLogs(filters: AdminActivityQueryDto) {
    return this.activityLogService.getRecentActivities(filters);
  }

  async getFamilyAccounts() {
    const families = await this.prisma.family.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            status: true,
            createdAt: true,
            subscription: {
              include: { plan: true },
            },
          },
        },
        elders: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalFamilies = families.length;
    const withActiveSubscription = families.filter(
      (family) => family.user.subscription?.status === 'ACTIVE',
    ).length;

    return {
      totalFamilies,
      withActiveSubscription,
      families: families.map((family) => {
        const subscription = family.user.subscription ?? undefined;
        const progress = subscription
          ? this.calculateSubscriptionProgress(subscription)
          : null;
        const daysRemaining = subscription
          ? Math.max(
              0,
              Math.ceil(
                (subscription.endDate.getTime() - Date.now()) / MS_IN_DAY,
              ),
            )
          : null;

        return {
          id: family.id,
          familyName: family.familyName,
          user: {
            id: family.user.id,
            email: family.user.email,
            status: family.user.status,
            createdAt: family.user.createdAt,
          },
          onboardingComplete: family.onboardingComplete,
          eldersCount: family.elders.length,
          subscription: subscription
            ? {
                id: subscription.id,
                planId: subscription.planId,
                planName: subscription.plan?.name,
                status: subscription.status,
                startDate: subscription.startDate,
                endDate: subscription.endDate,
                progressPercent: progress,
                daysRemaining,
              }
            : null,
        };
      }),
    };
  }

  async getCaregivers() {
    const caregivers = await this.prisma.caregiver.findMany({
      include: {
        user: true,
        caregiverRegion: true,
        programs: true,
        careRequests: { include: { elder: true } },
        certificates: true, 
      },
      orderBy: { createdAt: 'desc' },
    });

    return caregivers.map((c) => ({
      id: c.id,
      userId: c.userId,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email || c.user.email,
      phone: c.phone,
      status: c.user.status,
      gender: c.gender,
      region: c.caregiverRegion?.name || c.region,
      experience: c.experience,
      languages: c.languages || [],
      bio: c.bio,
      dateOfBirth: c.dateOfBirth,
      onboardingComplete: c.onboardingComplete,
      assignedElders: c.careRequests.length,
      programs: c.programs.map((p) => p.name),
      documents: {
        profilePicture: c.profilePicture,
        documentUrl: c.documentUrl,
        idPassportPhoto: c.idPassportPhoto,
        recommendationLetter: c.recommendationLetter,
        certificates: c.certificates || [],
      },
      createdAt: c.createdAt,
    }));
  }

  async getFeatureActivity() {
    const logs = await this.activityLogService.getRecentActivities({
      category: ActivityCategory.FEATURE_USAGE,
      limit: 200,
    });

    const caregivingEvents = new Set([
      ActivityEvents.SCHEDULE_ITEM_COMPLETED,
      ActivityEvents.SCHEDULE_COMPLETED,
    ]);

    const onboardingEvents = new Set([
      ActivityEvents.FAMILY_ELDER_CREATED,
      ActivityEvents.FAMILY_ELDER_DELETED,
    ]);

    const dealsEvents = new Set<string>([
      'event.created',
      'event.updated',
      'event.registered',
    ]);

    return {
      caregiving: logs.filter((log) => caregivingEvents.has(log.eventType)),
      onboarding: logs.filter((log) => onboardingEvents.has(log.eventType)),
      deals: logs.filter((log) => dealsEvents.has(log.eventType)),
      raw: logs,
    };
  }
  async getElders() {
    const elders = await this.prisma.elder.findMany({
      include: {
        family: { include: { user: true } },
        program: true,
        careRequests: { include: { caregiver: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return elders.map((elder) => {
      const activeCaregiver = elder.careRequests[0]?.caregiver ?? null;
      return {
        id: elder.id,
        firstName: elder.firstName,
        lastName: elder.lastName,
        gender: elder.gender,
        dateOfBirth: elder.dateOfBirth,
        description: elder.description,
        family: elder.family
          ? {
              id: elder.family.id,
              familyName: elder.family.familyName,
              email: elder.family.user?.email,
            }
          : null,
        caregiver: activeCaregiver
          ? {
              id: activeCaregiver.id,
              name: `${activeCaregiver.firstName ?? ''} ${activeCaregiver.lastName ?? ''}`.trim(),
              email: activeCaregiver.email,
            }
          : null,
        program: elder.program
          ? { id: elder.program.id, name: elder.program.name }
          : null,
        createdAt: elder.createdAt,
      };
    });
  }

  async updateElder(elderId: string, dto: AdminUpdateElderDto) {
    const elder = await this.prisma.elder.findUnique({
      where: { id: elderId },
    });

    if (!elder) {
      throw new NotFoundException('Elder not found');
    }

    const updateData: Record<string, unknown> = { ...dto };

    if (dto.dateOfBirth) {
      updateData.dateOfBirth = new Date(dto.dateOfBirth);
    }

    return this.prisma.elder.update({
      where: { id: elderId },
      data: updateData,
    });
  }

  async deleteElder(elderId: string) {
    const elder = await this.prisma.elder.findUnique({
      where: { id: elderId },
    });

    if (!elder) {
      throw new NotFoundException('Elder not found');
    }

    await this.prisma.elder.delete({ where: { id: elderId } });

    return { success: true, elderId };
  }

  async updateCaregiverStatus(
    caregiverId: string,
    dto: UpdateCaregiverStatusDto,
  ) {
    const caregiver = await this.prisma.caregiver.findUnique({
      where: { id: caregiverId },
      include: {
        user: true,
      },
    });

    if (!caregiver) {
      throw new NotFoundException('Caregiver not found');
    }

    await this.prisma.user.update({
      where: { id: caregiver.userId },
      data: { status: dto.status },
    });

    return {
      success: true,
      caregiverId,
      userId: caregiver.userId,
      status: dto.status,
    };
  }

  async getSubscriptionActivity(limit = 100) {
    const prisma = this.prisma as any;

    const logs: ActivityLog[] = await prisma.activityLog.findMany({
      where: { eventType: ActivityEvents.SUBSCRIPTION_RENEWED },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return logs;
  }

  async getProfile(query: AdminProfileQueryDto) {
    const { type, id } = query;

    if (type === AdminProfileType.FAMILY) {
      const family = await this.prisma.family.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              status: true,
              createdAt: true,
              subscription: {
                include: { plan: true },
              },
            },
          },
          elders: true, // simple list; detailed caregiver fetched separately
        },
      });

      if (!family) throw new NotFoundException('Family not found');

      return {
        id: family.id,
        familyName: family.familyName,
        careFor: family.careFor,
        user: family.user,
        elders: family.elders,
        createdAt: family.createdAt,
        updatedAt: family.updatedAt,
        onboardingComplete: family.onboardingComplete,
      };
    }

    if (type === AdminProfileType.CAREGIVER) {
      const caregiver = await this.prisma.caregiver.findUnique({
        where: { id },
        include: {
          user: {
            select: { id: true, email: true, status: true, createdAt: true },
          },
          caregiverRegion: { select: { name: true } },
          programs: { select: { name: true } },
          careRequests: {
            where: { status: 'ACCEPTED' },
            include: { elder: true },
          },
          certificates: true,
        },
      });

      if (!caregiver) throw new NotFoundException('Caregiver not found');

      return {
        id: caregiver.id,
        firstName: caregiver.firstName,
        lastName: caregiver.lastName,
        email: caregiver.email,
        phone: caregiver.phone,
        gender: caregiver.gender,
        region: caregiver.region,
        user: caregiver.user,
        caregiverRegion: caregiver.caregiverRegion,
        programs: caregiver.programs,
        elders: caregiver.careRequests.map((cr) => ({
          id: cr.elder.id,
          firstName: cr.elder.firstName,
          lastName: cr.elder.lastName,
        })),
        onboardingComplete: caregiver.onboardingComplete,
        experience: caregiver.experience,
        bio: caregiver.bio,
        languages: caregiver.languages || [],
        documents: {
          profilePicture: caregiver.profilePicture,
          documentUrl: caregiver.documentUrl,
          idPassportPhoto: caregiver.idPassportPhoto,
          recommendationLetter: caregiver.recommendationLetter,
          certificates: caregiver.certificates || [],
        },
        createdAt: caregiver.createdAt,
      };
    }

    if (type === AdminProfileType.ELDER) {
      const elder = await this.prisma.elder.findUnique({
        where: { id },
        include: {
          family: { select: { id: true, familyName: true } },
          careRequests: {
            where: { status: 'ACCEPTED' },
            include: { caregiver: true },
          },
          program: { select: { id: true, name: true } },
        },
      });

      if (!elder) throw new NotFoundException('Elder not found');

      // pick first accepted caregiver if exists
      const activeCaregiver = elder.careRequests[0]?.caregiver ?? null;

      return {
        id: elder.id,
        firstName: elder.firstName,
        lastName: elder.lastName,
        gender: elder.gender,
        dateOfBirth: elder.dateOfBirth,
        description: elder.description,
        family: elder.family,
        caregiver: activeCaregiver
          ? {
              id: activeCaregiver.id,
              name: `${activeCaregiver.firstName ?? ''} ${activeCaregiver.lastName ?? ''}`.trim(),
              email: activeCaregiver.email,
            }
          : null,
        program: elder.program,
        createdAt: elder.createdAt,
      };
    }

    throw new NotFoundException(`Unsupported profile type: ${type}`);
  }

  async getGenderCounts() {
    const caregivers = await this.prisma.caregiver.findMany({
      select: { gender: true },
    });

    const elders = await this.prisma.elder.findMany({
      select: { gender: true },
    });

    const caregiverCounts = this.aggregateStringGenderCounts(
      caregivers.map((c) => c.gender),
    );
    const elderCounts = this.aggregateEnumGenderCounts(
      elders.map((e) => e.gender),
    );

    return {
      caregivers: caregiverCounts,
      elders: elderCounts,
    };
  }

  async getReports() {
    // 1. Care completion rate
    const [totalScheduleItems, completedScheduleItems] = await Promise.all([
      this.prisma.scheduleItem.count(),
      this.prisma.scheduleItem.count({ where: { status: 'COMPLETED' } }),
    ]);
  
    const careCompletionRate =
      totalScheduleItems > 0
        ? Math.round((completedScheduleItems / totalScheduleItems) * 100)
        : 0;
  
    // 2. Active families and caregivers
    const [activeFamilies, activeCaregivers] = await Promise.all([
      this.prisma.user.count({
        where: { role: 'FAMILY', status: AccountStatus.ACTIVE },
      }),
      this.prisma.user.count({
        where: { role: 'CAREGIVER', status: AccountStatus.ACTIVE },
      }),
    ]);
  
    // 3. Total families and caregivers
    const [totalFamilies, totalCaregivers] = await Promise.all([
      this.prisma.user.count({ where: { role: 'FAMILY' } }),
      this.prisma.user.count({ where: { role: 'CAREGIVER' } }),
    ]);
  
    // 4-8. Elders with caregivers, caregivers with elders, families with caregivers, unique connections
    const acceptedRequests = await this.prisma.careRequest.findMany({
      where: { status: 'ACCEPTED' },
      select: {
        elderId: true,
        caregiverId: true,
        familyId: true,
      },
    });
  
    const eldersWithCaregivers = new Set(acceptedRequests.map(r => r.elderId)).size;
    const caregiversWithElders = new Set(acceptedRequests.map(r => r.caregiverId)).size;
    const familiesWithCaregivers = new Set(acceptedRequests.map(r => r.familyId)).size;
    const uniqueConnections = new Set(
      acceptedRequests.map(r => `${r.familyId}-${r.caregiverId}`)
    );
  
    // 9. Pending caregivers
    const pendingCaregivers = await this.prisma.user.count({
      where: { role: 'CAREGIVER', status: AccountStatus.PENDING },
    });
  
    // 10. Active subscriptions
    const activeSubscriptions = await this.prisma.subscription.count({
      where: { status: 'ACTIVE' },
    });
  
    // 11. Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
    const recentActivityCount = await this.prisma.activityLog.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });
  
    // 12. Detailed lists
    const [
      activeFamiliesList,
      activeCaregiversList,
      pendingCaregiversList,
      activeConnectionsList,
    ] = await Promise.all([
      // Active Families
      this.prisma.family.findMany({
        where: { user: { status: AccountStatus.ACTIVE } },
        select: { id: true, familyName: true, user: { select: { email: true, status: true } } },
      }),
      // Active Caregivers
      this.prisma.caregiver.findMany({
        where: { user: { status: AccountStatus.ACTIVE } },
        select: { id: true, firstName: true, lastName: true, user: { select: { email: true, status: true } } },
      }),
      // Pending Caregivers
      this.prisma.caregiver.findMany({
        where: { user: { status: AccountStatus.PENDING } },
        select: { id: true, firstName: true, lastName: true, user: { select: { email: true, status: true } } },
      }),
      // Active Connections via accepted care requests
      this.prisma.careRequest.findMany({
        where: { status: 'ACCEPTED' },
        select: {
          elder: { select: { firstName: true, lastName: true } },
          caregiver: { select: { firstName: true, lastName: true } },
          family: { select: { familyName: true } },
        },
      }),
    ]);
  
    const totalElders = await this.prisma.elder.count();
  
    return {
      overview: {
        totalFamilies,
        activeFamilies,
        totalCaregivers,
        activeCaregivers,
        pendingCaregivers,
        totalElders,
        eldersWithCaregivers,
        totalConnections: uniqueConnections.size,
        activeSubscriptions,
      },
      careMetrics: {
        careCompletionRate,
        totalScheduleItems,
        completedScheduleItems,
        pendingScheduleItems: totalScheduleItems - completedScheduleItems,
      },
      matchingMetrics: {
        familiesWithCaregivers,
        familiesWithoutCaregivers: totalFamilies - familiesWithCaregivers,
        caregiversWithElders,
        caregiversWithoutElders: totalCaregivers - caregiversWithElders,
        eldersWithCaregivers,
        eldersWithoutCaregivers: totalElders - eldersWithCaregivers,
        matchRate: totalElders > 0 ? Math.round((eldersWithCaregivers / totalElders) * 100) : 0,
      },
      activity: { recentActivityCount, periodDays: 30 },
      details: {
        activeFamilies: activeFamiliesList.map(f => ({
          id: f.id,
          name: f.familyName,
          email: f.user.email,
          status: f.user.status,
        })),
        activeCaregivers: activeCaregiversList.map(c => ({
          id: c.id,
          name: `${c.firstName} ${c.lastName}`,
          email: c.user.email,
          status: c.user.status,
        })),
        pendingCaregivers: pendingCaregiversList.map(c => ({
          id: c.id,
          name: `${c.firstName} ${c.lastName}`,
          email: c.user.email,
          status: c.user.status,
        })),
        connections: activeConnectionsList.map(c => ({
          elderName: `${c.elder.firstName} ${c.elder.lastName}`,
          familyName: c.family.familyName,
          caregiverName: `${c.caregiver.firstName} ${c.caregiver.lastName}`,
        })),
      },
    };
  }

  async getStripeBalance() {
    try {
      // Fetch Stripe balance
      const balance = await this.stripe.balance.retrieve();

      // Fetch total revenue from local database
      const totalTransactions = await this.prisma.paymentTransaction.aggregate({
        where: { status: 'SUCCEEDED' },
        _sum: { amount: true },
        _count: true,
      });

      // Fetch subscription revenue
      const subscriptionRevenue = await this.prisma.paymentTransaction.aggregate({
        where: { 
          status: 'SUCCEEDED',
          type: 'SUBSCRIPTION'
        },
        _sum: { amount: true },
        _count: true,
      });

      // Fetch caregiver payout revenue
      const caregiverPayouts = await this.prisma.paymentTransaction.aggregate({
        where: { 
          status: 'SUCCEEDED',
          type: 'CAREGIVER_PAYOUT'
        },
        _sum: { amount: true },
        _count: true,
      });

      // Convert Stripe balance from cents to dollars
      const availableBalance = balance.available.map(b => ({
        amount: b.amount / 100,
        currency: b.currency.toUpperCase(),
      }));

      const pendingBalance = balance.pending.map(b => ({
        amount: b.amount / 100,
        currency: b.currency.toUpperCase(),
      }));

      return {
        stripe: {
          available: availableBalance,
          pending: pendingBalance,
          livemode: balance.livemode,
        },
        database: {
          totalRevenue: totalTransactions._sum.amount || 0,
          totalTransactions: totalTransactions._count,
          subscriptionRevenue: subscriptionRevenue._sum.amount || 0,
          subscriptionCount: subscriptionRevenue._count,
          caregiverPayouts: caregiverPayouts._sum.amount || 0,
          caregiverPayoutCount: caregiverPayouts._count,
        },
        summary: {
          totalRevenue: totalTransactions._sum.amount || 0,
          stripeAvailable: availableBalance[0]?.amount || 0,
          stripePending: pendingBalance[0]?.amount || 0,
          currency: availableBalance[0]?.currency || 'USD',
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch Stripe balance: ${error.message}`);
    }
  }
  
  

  private calculateSubscriptionProgress(subscription: {
    startDate: Date;
    endDate: Date;
  }) {
    const now = Date.now();
    const start = subscription.startDate.getTime();
    const end = subscription.endDate.getTime();

    if (end <= start) {
      return 100;
    }

    const progress = (now - start) / (end - start);
    return Math.min(100, Math.max(0, Math.round(progress * 100)));
  }

  private aggregateStringGenderCounts(values: (string | null | undefined)[]) {
    return values.reduce<Record<string, number>>((acc, gender) => {
      const key = gender?.toLowerCase() || 'unspecified';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
  }

  private aggregateEnumGenderCounts(values: (Gender | null | undefined)[]) {
    return values.reduce<Record<string, number>>((acc, gender) => {
      const key = gender ?? 'UNSPECIFIED';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
  }
}
