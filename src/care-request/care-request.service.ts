// src/care-request/care-request.service.ts
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CareType,
  CreateCareRequestDto,
  DayOfWeek,
} from './dto/create-care-request.dto';
import { UpdateCareRequestDto } from './dto/update-care-request.dto';
import { CareRequest, Prisma, RequestStatus } from '@prisma/client';

@Injectable()
export class CareRequestService {
  private readonly defaultScheduleItems = [
    {
      title: 'Morning Medication & Breakfast',
      startTime: '08:00',
      endTime: '09:00',
      description: 'Administer morning medication and assist with breakfast',
    },
    {
      title: 'Personal Care',
      startTime: '10:00',
      endTime: '11:00',
      description: 'Assist with bathing, grooming, and dressing',
    },
    {
      title: 'Lunch & Medication',
      startTime: '12:30',
      endTime: '13:30',
      description: 'Assist with lunch and administer midday medication',
    },
    {
      title: 'Afternoon Activities',
      startTime: '15:00',
      endTime: '16:00',
      description: 'Light exercise and social activities',
    },
    {
      title: 'Dinner & Medication',
      startTime: '18:00',
      endTime: '19:00',
      description: 'Assist with dinner and administer evening medication',
    },
    {
      title: 'Evening Care',
      startTime: '20:00',
      endTime: '21:00',
      description: 'Prepare for bed and assist with nighttime routine',
    },
  ];

  constructor(private prisma: PrismaService) {}

  /** Create a new care request */
  async createCareRequest(userId: string, dto: CreateCareRequestDto) {
    // Validate input before transaction
    if (
      dto.careType === 'PART_TIME' &&
      (!dto.careDays || dto.careDays.length === 0)
    ) {
      throw new BadRequestException('careDays required for PART_TIME');
    }
    if (dto.careType === 'FULL_TIME' && dto.careDays?.length) {
      throw new BadRequestException('careDays not allowed for FULL_TIME');
    }

    return this.prisma.$transaction(async (tx) => {
      // Batch all validation queries in parallel
      const [family, elder, caregiver, duplicatePending] = await Promise.all([
        tx.family.findFirst({ where: { userId } }),
        tx.elder.findFirst({ where: { id: dto.elderId } }),
        tx.caregiver.findUnique({ where: { id: dto.caregiverId } }),
        tx.careRequest.findFirst({
          where: {
            elderId: dto.elderId,
            caregiverId: dto.caregiverId,
            status: 'PENDING',
          },
        }),
      ]);

      // Validate results
      if (!family) throw new NotFoundException('Family not found');
      if (!elder) throw new NotFoundException('Elder not found');
      if (elder.familyId !== family.id)
        throw new ForbiddenException('Elder does not belong to this family');
      if (!caregiver) throw new NotFoundException('Caregiver not found');
      if (duplicatePending)
        throw new ConflictException('Pending request already exists');

      // Create care request
      return tx.careRequest.create({
        data: {
          elderId: elder.id,
          caregiverId: caregiver.id,
          familyId: family.id,
          careType: dto.careType,
          careDays: dto.careType === 'PART_TIME' ? dto.careDays : [],
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
    });
  }

  /** Accept a care request */
  async acceptCareRequest(userId: string, requestId: string) {
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.careRequest.findUnique({
        where: { id: requestId },
        include: { caregiver: true },
      });
      if (!request) throw new NotFoundException();
      if (request.caregiver.userId !== userId) throw new ForbiddenException();
      if (request.status !== 'PENDING')
        throw new BadRequestException('Request not pending');

      // Batch all updates together
      const [acceptedRequest] = await Promise.all([
        // Accept this request
        tx.careRequest.update({
          where: { id: request.id },
          data: { status: 'ACCEPTED', respondedAt: new Date() },
        }),
        // Reject other pending requests for same elder
        tx.careRequest.updateMany({
          where: {
            elderId: request.elderId,
            status: 'PENDING',
            NOT: { id: request.id },
          },
          data: { status: 'REJECTED' },
        }),
      ]);

      // Create schedules in batch
      await this.createSchedulesForAcceptedRequest(tx, request);

      return acceptedRequest;
    });
  }

  /** Private helper to create schedules - optimized batch creation */
  private async createSchedulesForAcceptedRequest(
    tx: Prisma.TransactionClient,
    request: CareRequest,
  ) {
    const days =
      request.careType === 'FULL_TIME'
        ? Object.values(DayOfWeek)
        : request.careDays;

    // Batch create all schedules at once
    const schedules = await Promise.all(
      days.map((day) =>
        tx.schedule.create({
          data: {
            elderId: request.elderId,
            careRequestId: request.id,
            day,
            start: '08:00',
            end: '21:00',
          },
        }),
      ),
    );

    // Batch create all schedule items for all schedules
    const allScheduleItems = schedules.flatMap((schedule) =>
      this.defaultScheduleItems.map((item) => ({
        scheduleId: schedule.id,
        title: item.title,
        description: item.description,
        startTime: item.startTime,
        endTime: item.endTime,
      })),
    );

    // Single createMany for all items (7 days × 6 items = 42 items in one query)
    await tx.scheduleItem.createMany({
      data: allScheduleItems,
    });
  }

  /** Get all care requests for a user (family or caregiver) */
  async findAllForUser(userId: string) {
    // Single query with conditional logic - much faster
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        family: true,
        caregiver: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    if (user.role === 'FAMILY' && user.family) {
      return this.prisma.careRequest.findMany({
        where: { familyId: user.family.id },
      });
    } else if (user.role === 'CAREGIVER' && user.caregiver) {
      return this.prisma.careRequest.findMany({
        where: { caregiverId: user.caregiver.id },
      });
    }
    return [];
  }

  /** Get a specific care request by id (only if belongs to user) */
  async findOne(userId: string, requestId: string) {
    const request = await this.prisma.careRequest.findUnique({
      where: { id: requestId },
      include: {
        caregiver: { include: { user: true } },
        family: { include: { user: true } },
      },
    });
    if (!request) throw new NotFoundException('Care request not found');

    // Check ownership using included data
    const isFamilyOwner = request.family.userId === userId;
    const isCaregiverOwner = request.caregiver.userId === userId;

    if (!isFamilyOwner && !isCaregiverOwner) {
      throw new ForbiddenException();
    }

    return request;
  }

  /** Update a care request */
  async update(userId: string, requestId: string, dto: UpdateCareRequestDto) {
    const request = await this.prisma.careRequest.findUnique({
      where: { id: requestId },
      include: { family: { include: { user: true } } },
    });
    if (!request) throw new NotFoundException('Care request not found');

    // Only family can update before acceptance
    if (request.status !== 'PENDING')
      throw new BadRequestException('Cannot update non-pending request');
    if (request.family.userId !== userId) throw new ForbiddenException();

    return this.prisma.careRequest.update({
      where: { id: requestId },
      data: {
        careType: dto.careType ?? request.careType,
        careDays: dto.careDays ?? request.careDays,
        status: dto.status ?? request.status,
      },
    });
  }

  /** Delete a care request */
  async remove(userId: string, requestId: string) {
    const request = await this.prisma.careRequest.findUnique({
      where: { id: requestId },
      include: { family: { include: { user: true } } },
    });
    if (!request) throw new NotFoundException('Care request not found');

    // Only family can delete before acceptance
    if (request.status !== 'PENDING')
      throw new BadRequestException('Cannot delete non-pending request');
    if (request.family.userId !== userId) throw new ForbiddenException();

    return this.prisma.careRequest.delete({ where: { id: requestId } });
  }

  /** Reject a care request (caregiver) */
  async rejectCareRequest(userId: string, requestId: string) {
    const request = await this.prisma.careRequest.findUnique({
      where: { id: requestId },
      include: { caregiver: true },
    });
    if (!request) throw new NotFoundException('Care request not found');
    if (request.caregiver.userId !== userId) throw new ForbiddenException();
    if (request.status !== 'PENDING')
      throw new BadRequestException('Request not pending');

    return this.prisma.careRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED', respondedAt: new Date() },
    });
  }

  async removeCaregiverFromFamily(
    caregiverId: string,
    elderId: string,
    reason?: string,
    actorId?: string,
  ) {
    // Check if caregiver exists
    console.log(caregiverId, elderId);
    const caregiver = await this.prisma.caregiver.findUnique({
      where: { id: caregiverId },
      include: { user: true },
    });

    if (!caregiver) {
      throw new NotFoundException('Caregiver not found');
    }

    // Check if elder exists
    const elder = await this.prisma.elder.findUnique({
      where: { id: elderId },
    });

    if (!elder) {
      throw new NotFoundException('Elder not found');
    }

    // Find all active care requests between this caregiver and family
    const careRequests = await this.prisma.careRequest.findMany({
      where: {
        caregiverId,
        elderId,
        status: { in: ['PENDING', 'ACCEPTED'] }, // Only active requests
      },
      include: {
        elder: true,
        family: true, // Add this to include family data
        schedules: {
          include: {
            scheduleItems: true,
          },
        },
      },
    });

    if (careRequests.length === 0) {
      throw new BadRequestException(
        'No active care relationship found between this caregiver and family',
      );
    }

    // Get the family from the first care request
    const family = careRequests[0].family;
    const familyId = family.id;

    return await this.prisma.$transaction(async (tx) => {
      // Get all schedule IDs first for logging
      const allScheduleIds = careRequests.flatMap((request) =>
        request.schedules.map((schedule) => schedule.id),
      );

      const allScheduleItemIds = careRequests.flatMap((request) =>
        request.schedules.flatMap((schedule) =>
          schedule.scheduleItems.map((item) => item.id),
        ),
      );

      // 1. Delete schedule items first (due to foreign key constraints)
      if (allScheduleItemIds.length > 0) {
        await tx.scheduleItem.deleteMany({
          where: {
            id: { in: allScheduleItemIds },
          },
        });
      }

      // 2. Delete schedules
      if (allScheduleIds.length > 0) {
        await tx.schedule.deleteMany({
          where: {
            id: { in: allScheduleIds },
          },
        });
      }

      // 3. Update all care requests to CANCELLED
      const updatedRequests = await tx.careRequest.updateMany({
        where: {
          caregiverId,
          elderId,
          status: { in: ['PENDING', 'ACCEPTED'] },
        },
        data: {
          status: 'CANCELLED',
          updatedAt: new Date(),
        },
      });

      // 4. Create activity logs
      if (actorId) {
        for (const request of careRequests) {
          await tx.activityLog.create({
            data: {
              userId: actorId,
              actorRole: 'FAMILY',
              category: 'USER_ACTIVITY',
              eventType: 'CARE_RELATIONSHIP_ENDED',
              entityType: 'CareRequest',
              entityId: request.id,
              metadata: {
                caregiverId,
                caregiverName: `${caregiver.firstName} ${caregiver.lastName}`,
                familyId: elder.familyId,
                familyName: family.familyName,
                elderId: request.elderId,
                elderName: `${request.elder.firstName} ${request.elder.lastName}`,
                reason,
                schedulesDeleted: request.schedules.length,
                scheduleItemsDeleted: request.schedules.reduce(
                  (total, schedule) => total + schedule.scheduleItems.length,
                  0,
                ),
                timestamp: new Date().toISOString(),
              },
            },
          });
        }
      }

      // 5. Send notifications to both parties
      const notificationPromises: Promise<any>[] = [];

      // Notify caregiver
      notificationPromises.push(
        tx.notification.create({
          data: {
            userId: caregiver.userId,
            title: 'Care Relationship Ended',
            message: `Your care relationship with ${family.familyName}'s family has been ended. ${reason ? `Reason: ${reason}` : ''}`,
            type: 'CARE_RELATIONSHIP_CHANGE',
          },
        }),
      );

      // Notify family (get the family user ID from the family record)
      notificationPromises.push(
        tx.notification.create({
          data: {
            userId: family.userId,
            title: 'Caregiver Removed',
            message: `You have removed ${caregiver.firstName} ${caregiver.lastName} as a caregiver.`,
            type: 'CARE_RELATIONSHIP_CHANGE',
          },
        }),
      );

      await Promise.all(notificationPromises);

      return {
        message: 'Caregiver successfully removed from family',
        details: {
          caregiver: {
            id: caregiverId,
            name: `${caregiver.firstName} ${caregiver.lastName}`,
          },
          family: {
            id: familyId,
            name: family.familyName,
          },
          careRequestsCancelled: updatedRequests.count,
          schedulesDeleted: allScheduleIds.length,
          scheduleItemsDeleted: allScheduleItemIds.length,
          reason,
        },
      };
    });
  }
  
  async removeFamilyFromCaregiver(
    caregiverUserId: string,
    familyId: string,
    reason?: string,
    actorId?: string,
  ) {
    const caregiver = await this.prisma.caregiver.findUnique({
      where: { userId: caregiverUserId },
    });
  
    if (!caregiver) {
      throw new NotFoundException('Caregiver not found');
    }
  
    // Authorization check
    if (actorId && caregiver.userId !== actorId) {
      throw new ForbiddenException(
        'You are not allowed to remove this family',
      );
    }
  
    // Delegate to shared logic using DB caregiver.id
    return this.removeCaregiverFromFamily(
      caregiver.id,
      familyId,
      reason,
      actorId,
    );
  }
  

  async getCaregiverRelationships(caregiverId: string) {
    return this.prisma.careRequest.findMany({
      where: {
        caregiverId,
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
      include: {
        family: {
          include: {
            user: true,
          },
        },
        elder: true,
        schedules: true,
      },
      orderBy: {
        requestedAt: 'desc',
      },
    });
  }

  /** Cancel a care request */
  async cancelCareRequest(userId: string, requestId: string, reason?: string) {
    return this.prisma.$transaction(async (tx) => {
      // First, get the request with necessary relations
      const request = await tx.careRequest.findUnique({
        where: { id: requestId },
        include: {
          family: { include: { user: true } },
          caregiver: { include: { user: true } },
          elder: true,
        },
      });

      if (!request) {
        throw new NotFoundException('Care request not found');
      }

      // Check if user is authorized to cancel this request
      const isRequester = request.family.userId === userId;
      const isCaregiver = request.caregiver?.userId === userId;

      if (!isRequester && !isCaregiver) {
        throw new ForbiddenException('Not authorized to cancel this request');
      }

      // Check if request can be cancelled (only pending or accepted)
      if (request.status !== 'PENDING' && request.status !== 'ACCEPTED') {
        throw new BadRequestException(
          `Cannot cancel a request with status: ${request.status}. ` +
            `Only PENDING or ACCEPTED requests can be cancelled.`,
        );
      }

      // Check if request has expired (only for PENDING status)
      if (
        request.status === 'PENDING' &&
        request.expiresAt &&
        request.expiresAt < new Date()
      ) {
        // Auto-expire if expired
        await tx.careRequest.update({
          where: { id: requestId },
          data: {
            status: 'EXPIRED',
            updatedAt: new Date(),
          },
        });
        throw new BadRequestException('This request has already expired');
      }

      // Update the request status to CANCELLED
      const cancelledRequest = await tx.careRequest.update({
        where: { id: requestId },
        data: {
          status: 'CANCELLED',
          respondedAt:
            request.status === 'PENDING' ? new Date() : request.respondedAt,
          updatedAt: new Date(),
        },
        include: {
          family: { include: { user: true } },
          caregiver: { include: { user: true } },
          elder: true,
        },
      });

      // Create activity log with proper types
      await tx.activityLog.create({
        data: {
          userId,
          actorRole: isRequester ? 'FAMILY' : ('CAREGIVER' as any),
          category: 'USER_ACTIVITY',
          eventType: 'CARE_REQUEST_CANCELLED',
          entityType: 'CareRequest',
          entityId: request.id,
          metadata: {
            requestId: request.id,
            previousStatus: request.status,
            cancelledBy: isRequester ? 'family' : 'caregiver',
            familyName: request.family.familyName,
            caregiverName: request.caregiver
              ? `${request.caregiver.firstName} ${request.caregiver.lastName}`
              : 'Unknown',
            elderName: `${request.elder.firstName} ${request.elder.lastName}`,
            reason: reason || null,
            timestamp: new Date().toISOString(),
          } as any,
        },
      });

      // Send notification to the other party
      const notificationPromises: Promise<any>[] = [];

      if (isRequester && request.caregiver?.userId) {
        // If family cancelled, notify caregiver
        notificationPromises.push(
          tx.notification.create({
            data: {
              userId: request.caregiver.userId,
              title: 'Care Request Cancelled',
              message: `${request.family.familyName} has cancelled the care request for ${request.elder.firstName}.`,
              type: 'CARE_REQUEST_UPDATE',
            },
          }),
        );
      } else if (isCaregiver && request.family.userId) {
        // If caregiver cancelled, notify family
        notificationPromises.push(
          tx.notification.create({
            data: {
              userId: request.family.userId,
              title: 'Care Request Cancelled',
              message: `${request.caregiver.firstName} ${request.caregiver.lastName} has cancelled the care request for ${request.elder.firstName}.`,
              type: 'CARE_REQUEST_UPDATE',
            },
          }),
        );
      }

      // Send all notifications
      if (notificationPromises.length > 0) {
        await Promise.all(notificationPromises);
      }

      return {
        message: 'Care request cancelled successfully',
        data: cancelledRequest,
      };
    });
  }
  /** Auto-expire pending requests that have passed their expiry date */
  async expirePendingRequests() {
    const expiredRequests = await this.prisma.careRequest.findMany({
      where: {
        status: 'PENDING',
        expiresAt: {
          lt: new Date(),
        },
      },
      include: {
        family: true,
        caregiver: { include: { user: true } },
        elder: true,
      },
    });

    const results = await Promise.allSettled(
      expiredRequests.map(async (request) => {
        return this.prisma.$transaction(async (tx) => {
          // Update request status to EXPIRED
          const expiredRequest = await tx.careRequest.update({
            where: { id: request.id },
            data: {
              status: 'EXPIRED',
              updatedAt: new Date(),
            },
          });

          // Create activity log - skip for now or use an admin user
          // Since SYSTEM role is not in your enum, use ADMIN or null
          const adminUser = await tx.user.findFirst({
            where: { role: 'ADMIN' },
          });

          if (adminUser) {
            await tx.activityLog.create({
              data: {
                userId: adminUser.id,
                actorRole: 'ADMIN',
                category: 'FEATURE_USAGE',
                eventType: 'REQUEST_EXPIRED',
                entityType: 'CareRequest',
                entityId: request.id,
                metadata: {
                  requestId: request.id,
                  expiredAt: new Date().toISOString(),
                  originalExpiresAt: request.expiresAt?.toISOString(),
                  familyName: request.family.familyName,
                  caregiverName: request.caregiver
                    ? `${request.caregiver.firstName} ${request.caregiver.lastName}`
                    : 'Unknown',
                  elderName: `${request.elder.firstName} ${request.elder.lastName}`,
                } as any,
              },
            });
          }

          // Notify family
          await tx.notification.create({
            data: {
              userId: request.family.userId,
              title: 'Request Expired',
              message: `Your care request for ${request.elder.firstName} has expired without a response.`,
              type: 'CARE_REQUEST_UPDATE',
            },
          });

          return expiredRequest;
        });
      }),
    );

    return {
      message: `Processed ${expiredRequests.length} expired requests`,
      details: results,
    };
  }
  /** Get cancellable requests for a user */
  async getCancellableRequests(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        family: true,
        caregiver: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    let whereClause: any = {
      status: {
        in: [RequestStatus.PENDING, RequestStatus.ACCEPTED],
      },
    };

    if (user.role === 'FAMILY' && user.family) {
      whereClause.familyId = user.family.id;
    } else if (user.role === 'CAREGIVER' && user.caregiver) {
      whereClause.caregiverId = user.caregiver.id;
    } else {
      return [];
    }

    return this.prisma.careRequest.findMany({
      where: whereClause,
      include: {
        elder: true,
        family: user.role === 'CAREGIVER' ? { include: { user: true } } : false,
        caregiver: user.role === 'FAMILY' ? { include: { user: true } } : false,
        schedules: true,
      },
      orderBy: {
        requestedAt: 'desc',
      },
    });
  }
}
