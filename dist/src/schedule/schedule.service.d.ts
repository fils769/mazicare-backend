import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';
import { ScheduleStatus, DayOfWeek } from '@prisma/client';
export declare class ScheduleService {
    private prisma;
    constructor(prisma: PrismaService);
    createSchedule(elderId: string, data: CreateScheduleDto): Promise<any[]>;
    updateSchedule(elderId: string, data: UpdateScheduleDto): Promise<any[]>;
    private calculateDayTimeRange;
    private timeToMinutes;
    getTodaySchedule(elderId: string): Promise<({
        scheduleItems: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            updatedAt: Date;
            title: string;
            description: string | null;
            startTime: string;
            endTime: string;
            scheduleId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        updatedAt: Date;
        elderId: string;
        day: import(".prisma/client").$Enums.DayOfWeek;
        start: string;
        end: string;
        careRequestId: string;
    })[]>;
    getWeeklySchedule(elderId: string): Promise<({
        scheduleItems: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            updatedAt: Date;
            title: string;
            description: string | null;
            startTime: string;
            endTime: string;
            scheduleId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        updatedAt: Date;
        elderId: string;
        day: import(".prisma/client").$Enums.DayOfWeek;
        start: string;
        end: string;
        careRequestId: string;
    })[]>;
    getDaySchedule(elderId: string, day: DayOfWeek): Promise<({
        scheduleItems: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            updatedAt: Date;
            title: string;
            description: string | null;
            startTime: string;
            endTime: string;
            scheduleId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        updatedAt: Date;
        elderId: string;
        day: import(".prisma/client").$Enums.DayOfWeek;
        start: string;
        end: string;
        careRequestId: string;
    }) | null>;
    getElderSchedule(elderId: string): Promise<({
        scheduleItems: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            updatedAt: Date;
            title: string;
            description: string | null;
            startTime: string;
            endTime: string;
            scheduleId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        updatedAt: Date;
        elderId: string;
        day: import(".prisma/client").$Enums.DayOfWeek;
        start: string;
        end: string;
        careRequestId: string;
    })[]>;
    updateItemStatus(itemId: string, status: ScheduleStatus): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        updatedAt: Date;
        title: string;
        description: string | null;
        startTime: string;
        endTime: string;
        scheduleId: string;
    }>;
    deleteSchedule(scheduleId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        updatedAt: Date;
        elderId: string;
        day: import(".prisma/client").$Enums.DayOfWeek;
        start: string;
        end: string;
        careRequestId: string;
    }>;
    deleteAllDaySchedules(elderId: string, day: DayOfWeek): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
