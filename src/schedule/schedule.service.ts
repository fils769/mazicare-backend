import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';
import { ScheduleStatus, DayOfWeek } from '@prisma/client';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async createSchedule(elderId: string, data: CreateScheduleDto) {
    const elder = await this.prisma.elder.findUnique({
      where: { id: elderId },
      include: {
        careRequests: { where: { status: 'ACCEPTED' } },
      },
    });

    if (!elder) {
      throw new NotFoundException('Elder not found');
    }

    const acceptedCareRequest = elder.careRequests?.[0] ?? null;

    const createdDays: Array<{
      id: string;
      elderId: string;
      day: DayOfWeek;
      start: string;
      end: string;
      careRequestId: string | null;
      scheduleItems: Array<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: ScheduleStatus;
        title: string;
        startTime: string;
        endTime: string;
        scheduleId: string;
      }>;
    }> = [];

    for (const dayData of data.schedules) {
      if (!dayData.scheduleItems?.length) continue;

      const existingSchedule = await this.prisma.schedule.findFirst({
        where: { elderId, day: dayData.day as DayOfWeek },
      });

      if (existingSchedule) {
        throw new BadRequestException(
          `Schedule already exists for ${dayData.day}`,
        );
      }

      const sortedItems = [...dayData.scheduleItems].sort((a, b) =>
        a.startTime.localeCompare(b.startTime),
      );

      const schedule = await this.prisma.schedule.create({
        data: {
          elderId,
          day: dayData.day as DayOfWeek,
          start: sortedItems[0].startTime,
          end: sortedItems[sortedItems.length - 1].endTime,

          careRequestId: acceptedCareRequest?.id ?? null,

          scheduleItems: {
            create: dayData.scheduleItems.map((item) => ({
              title: item.title,
              description: item.description,
              startTime: item.startTime,
              endTime: item.endTime,
              status: item.status ?? ScheduleStatus.PENDING,
            })),
          },
        },
        include: { scheduleItems: true },
      });

      createdDays.push(schedule);
    }

    return createdDays;
  }

  /* ------------------- UPDATE FULL SCHEDULE ------------------- */
  async updateSchedule(elderId: string, data: UpdateScheduleDto) {
    console.log(
      '[updateSchedule] START =========================================',
    );
    console.log('[updateSchedule] called for elderId=', elderId);
    console.log('[updateSchedule] payload:', JSON.stringify(data, null, 2));

    if (!data.schedules || data.schedules.length === 0) {
      console.log(
        '[updateSchedule] WARNING: No schedules provided, returning []',
      );
      return [];
    }

    // 1. Ensure elder exists and has an accepted CareRequest
    const elder = await this.prisma.elder.findUnique({
      where: { id: elderId },
      include: {
        careRequests: { where: { status: 'ACCEPTED' } },
      },
    });

    if (!elder) {
      throw new NotFoundException('Elder not found');
    }

    if (!elder.careRequests || elder.careRequests.length === 0) {
      throw new BadRequestException(
        'Cannot update schedule: elder does not have an accepted caregiver assignment',
      );
    }

    try {
      const updatedSchedules: any[] = [];

      await this.prisma.$transaction(async (tx) => {
        for (const dayData of data.schedules!) {
          console.log(
            `\n[updateSchedule] === Processing day: ${dayData.day} ===`,
          );

          if (!dayData.scheduleItems || dayData.scheduleItems.length === 0) {
            console.log(
              `[updateSchedule] Day ${dayData.day} has no items, deleting schedule if exists`,
            );
            const deleted = await tx.schedule.deleteMany({
              where: { elderId, day: dayData.day },
            });
            console.log(
              `[updateSchedule] Deleted ${deleted.count} schedule(s) for ${dayData.day}`,
            );
            continue;
          }

          // Compute day start/end
          const sortedItems = dayData.scheduleItems.sort((a, b) =>
            a.startTime.localeCompare(b.startTime),
          );
          const dayStart = sortedItems[0].startTime;
          const dayEnd = sortedItems[sortedItems.length - 1].endTime;
          console.log(
            `[updateSchedule] Computed: dayStart=${dayStart}, dayEnd=${dayEnd}`,
          );

          // Check existing schedule
          const existingSchedule = await tx.schedule.findFirst({
            where: { elderId, day: dayData.day },
            include: { scheduleItems: { orderBy: { startTime: 'asc' } } },
          });

          if (existingSchedule) {
            console.log(
              `[updateSchedule] Found existing schedule id=${existingSchedule.id}`,
            );

            // Update day times
            await tx.schedule.update({
              where: { id: existingSchedule.id },
              data: { start: dayStart, end: dayEnd },
            });

            const newItemIds: string[] = [];

            for (const itemData of dayData.scheduleItems) {
              // Try update existing item by startTime
              const existingItem = existingSchedule.scheduleItems.find(
                (item) => item.startTime === itemData.startTime,
              );

              if (existingItem) {
                const updatedItem = await tx.scheduleItem.update({
                  where: { id: existingItem.id },
                  data: {
                    title: itemData.title,
                    description: itemData.description,
                    startTime: itemData.startTime,
                    endTime: itemData.endTime,
                    status: itemData.status ?? ScheduleStatus.PENDING,
                  },
                });
                newItemIds.push(updatedItem.id);
              } else {
                const newItem = await tx.scheduleItem.create({
                  data: {
                    scheduleId: existingSchedule.id,
                    title: itemData.title,
                    description: itemData.description,
                    startTime: itemData.startTime,
                    endTime: itemData.endTime,
                    status: itemData.status ?? ScheduleStatus.PENDING,
                  },
                });
                newItemIds.push(newItem.id);
              }
            }

            // Delete removed items
            const itemsToDelete = existingSchedule.scheduleItems
              .filter((item) => !newItemIds.includes(item.id))
              .map((item) => item.id);

            if (itemsToDelete.length > 0) {
              await tx.scheduleItem.deleteMany({
                where: { id: { in: itemsToDelete } },
              });
            }

            const finalSchedule = await tx.schedule.findUnique({
              where: { id: existingSchedule.id },
              include: { scheduleItems: { orderBy: { startTime: 'asc' } } },
            });

            updatedSchedules.push(finalSchedule!);
          } else {
            // Create new schedule
            const created = await tx.schedule.create({
              data: {
                elderId,
                day: dayData.day,
                start: dayStart,
                end: dayEnd,
                careRequestId: elder.careRequests[0].id, // Include the required careRequestId
                scheduleItems: {
                  create: dayData.scheduleItems.map((item) => ({
                    title: item.title,
                    description: item.description,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    status: item.status ?? ScheduleStatus.PENDING,
                  })),
                },
              },
              include: { scheduleItems: { orderBy: { startTime: 'asc' } } },
            });

            updatedSchedules.push(created);
          }

          console.log(`[updateSchedule] ✓ Completed day: ${dayData.day}`);
        }
      });

      console.log(`[updateSchedule] ✓ Transaction committed successfully`);
      return updatedSchedules;
    } catch (error) {
      console.error('[updateSchedule] ✗ TRANSACTION FAILED:', error);
      throw new Error(`Failed to update schedule: ${error.message}`);
    }
  }

  // Helper methods
  private calculateDayTimeRange(scheduleItems: any[]): {
    dayStart: string;
    dayEnd: string;
  } {
    if (!scheduleItems || scheduleItems.length === 0) {
      return { dayStart: '00:00', dayEnd: '00:00' };
    }

    // Convert to minutes for proper time comparison
    const itemsWithMinutes = scheduleItems.map((item) => ({
      ...item,
      startMinutes: this.timeToMinutes(item.startTime),
      endMinutes: this.timeToMinutes(item.endTime),
    }));

    // Sort by start time
    const sortedByStart = [...itemsWithMinutes].sort(
      (a, b) => a.startMinutes - b.startMinutes,
    );
    const sortedByEnd = [...itemsWithMinutes].sort(
      (a, b) => b.endMinutes - a.endMinutes,
    );

    const dayStart = sortedByStart[0].startTime;
    const dayEnd = sortedByEnd[0].endTime;

    console.log(
      `[calculateDayTimeRange] Found ${scheduleItems.length} items, earliest: ${dayStart}, latest: ${dayEnd}`,
    );

    return { dayStart, dayEnd };
  }

  private timeToMinutes(timeStr: string): number {
    if (!timeStr || !timeStr.includes(':')) return 0;

    const [hours, minutes] = timeStr.split(':').map(Number);

    // Handle 24-hour times
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      console.warn(`[timeToMinutes] Invalid time format: ${timeStr}`);
      return 0;
    }

    return hours * 60 + minutes;
  }

  /* ------------------- GET TODAY'S SCHEDULE ------------------- */
  async getTodaySchedule(elderId: string) {
    const today = new Date()
      .toLocaleString('en-US', { weekday: 'long' })
      .toUpperCase() as DayOfWeek;

    return this.prisma.schedule.findMany({
      where: { elderId, day: today },
      include: { scheduleItems: true },
    });
  }

  /* ------------------- GET WEEKLY SCHEDULE ------------------- */
  async getWeeklySchedule(elderId: string) {
    return this.prisma.schedule.findMany({
      where: { elderId },
      include: { scheduleItems: true },
      orderBy: { day: 'asc' },
    });
  }

  /* ------------------- GET SCHEDULE FOR SPECIFIC DAY ------------------- */
  async getDaySchedule(elderId: string, day: DayOfWeek) {
    return this.prisma.schedule.findFirst({
      where: { elderId, day },
      include: { scheduleItems: true },
    });
  }

  /* ------------------- GET ALL SCHEDULES ------------------- */
  async getElderSchedule(elderId: string) {
    return this.prisma.schedule.findMany({
      where: { elderId },
      include: { scheduleItems: true },
      orderBy: { day: 'asc' },
    });
  }

  /* ------------------- UPDATE ITEM STATUS ------------------- */
  async updateItemStatus(itemId: string, status: ScheduleStatus) {
    return this.prisma.scheduleItem.update({
      where: { id: itemId },
      data: { status },
    });
  }

  /* ------------------- DELETE SPECIFIC SCHEDULE ------------------- */
  async deleteSchedule(scheduleId: string) {
    return this.prisma.schedule.delete({
      where: { id: scheduleId },
    });
  }

  /* ------------------- DELETE ALL DAY SCHEDULES ------------------- */
  async deleteAllDaySchedules(elderId: string, day: DayOfWeek) {
    return this.prisma.schedule.deleteMany({
      where: { elderId, day },
    });
  }
}
