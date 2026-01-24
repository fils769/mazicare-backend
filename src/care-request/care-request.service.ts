// src/care-request/care-request.service.ts
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CareType, CreateCareRequestDto, DayOfWeek } from './dto/create-care-request.dto';
import { UpdateCareRequestDto } from './dto/update-care-request.dto';
import { CareRequest, Prisma } from '@prisma/client';

@Injectable()
export class CareRequestService {
  private readonly defaultScheduleItems = [
    { title: 'Morning Medication & Breakfast', startTime: '08:00', endTime: '09:00', description: 'Administer morning medication and assist with breakfast' },
    { title: 'Personal Care', startTime: '10:00', endTime: '11:00', description: 'Assist with bathing, grooming, and dressing' },
    { title: 'Lunch & Medication', startTime: '12:30', endTime: '13:30', description: 'Assist with lunch and administer midday medication' },
    { title: 'Afternoon Activities', startTime: '15:00', endTime: '16:00', description: 'Light exercise and social activities' },
    { title: 'Dinner & Medication', startTime: '18:00', endTime: '19:00', description: 'Assist with dinner and administer evening medication' },
    { title: 'Evening Care', startTime: '20:00', endTime: '21:00', description: 'Prepare for bed and assist with nighttime routine' },
  ];

  constructor(private prisma: PrismaService) {}

  /** Create a new care request */
  async createCareRequest(userId: string, dto: CreateCareRequestDto) {
    // Validate input before transaction
    if (dto.careType === 'PART_TIME' && (!dto.careDays || dto.careDays.length === 0)) {
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
            status: 'PENDING' 
          },
        }),
      ]);

      // Validate results
      if (!family) throw new NotFoundException('Family not found');
      if (!elder) throw new NotFoundException('Elder not found');
      if (elder.familyId !== family.id) throw new ForbiddenException('Elder does not belong to this family');
      if (!caregiver) throw new NotFoundException('Caregiver not found');
      if (duplicatePending) throw new ConflictException('Pending request already exists');

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
      if (request.status !== 'PENDING') throw new BadRequestException('Request not pending');

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
  private async createSchedulesForAcceptedRequest(tx: Prisma.TransactionClient, request: CareRequest) {
    const days = request.careType === 'FULL_TIME' ? Object.values(DayOfWeek) : request.careDays;

    // Batch create all schedules at once
    const schedules = await Promise.all(
      days.map(day =>
        tx.schedule.create({
          data: { elderId: request.elderId, careRequestId: request.id, day, start: '08:00', end: '21:00' },
        })
      )
    );

    // Batch create all schedule items for all schedules
    const allScheduleItems = schedules.flatMap(schedule =>
      this.defaultScheduleItems.map(item => ({
        scheduleId: schedule.id,
        title: item.title,
        description: item.description,
        startTime: item.startTime,
        endTime: item.endTime,
      }))
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
      }
    });
    if (!user) throw new NotFoundException('User not found');

    if (user.role === 'FAMILY' && user.family) {
      return this.prisma.careRequest.findMany({ where: { familyId: user.family.id } });
    } else if (user.role === 'CAREGIVER' && user.caregiver) {
      return this.prisma.careRequest.findMany({ where: { caregiverId: user.caregiver.id } });
    }
    return [];
  }

  /** Get a specific care request by id (only if belongs to user) */
  async findOne(userId: string, requestId: string) {
    const request = await this.prisma.careRequest.findUnique({
      where: { id: requestId },
      include: { 
        caregiver: { include: { user: true } },
        family: { include: { user: true } }
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
    if (request.status !== 'PENDING') throw new BadRequestException('Cannot update non-pending request');
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
    if (request.status !== 'PENDING') throw new BadRequestException('Cannot delete non-pending request');
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
    if (request.status !== 'PENDING') throw new BadRequestException('Request not pending');

    return this.prisma.careRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED', respondedAt: new Date() },
    });
  }
}
