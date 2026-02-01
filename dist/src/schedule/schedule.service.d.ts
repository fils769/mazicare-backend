import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';
import { ScheduleStatus, DayOfWeek } from '@prisma/client';
export declare class ScheduleService {
    private prisma;
    constructor(prisma: PrismaService);
    createSchedule(elderId: string, data: CreateScheduleDto): Promise<{
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
    }[]>;
    updateSchedule(elderId: string, data: UpdateScheduleDto): Promise<any[]>;
    private calculateDayTimeRange;
    private timeToMinutes;
    getTodaySchedule(elderId: string): Promise<({
        scheduleItems: {
            id: string;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            createdAt: Date;
            updatedAt: Date;
            scheduleId: string;
            title: string;
            description: string | null;
            startTime: string;
            endTime: string;
        }[];
    } & {
        id: string;
        elderId: string;
        careRequestId: string | null;
        day: import(".prisma/client").$Enums.DayOfWeek;
        start: string;
        end: string;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getWeeklySchedule(elderId: string): Promise<({
        scheduleItems: {
            id: string;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            createdAt: Date;
            updatedAt: Date;
            scheduleId: string;
            title: string;
            description: string | null;
            startTime: string;
            endTime: string;
        }[];
    } & {
        id: string;
        elderId: string;
        careRequestId: string | null;
        day: import(".prisma/client").$Enums.DayOfWeek;
        start: string;
        end: string;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getDaySchedule(elderId: string, day: DayOfWeek): Promise<({
        scheduleItems: {
            id: string;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            createdAt: Date;
            updatedAt: Date;
            scheduleId: string;
            title: string;
            description: string | null;
            startTime: string;
            endTime: string;
        }[];
    } & {
        id: string;
        elderId: string;
        careRequestId: string | null;
        day: import(".prisma/client").$Enums.DayOfWeek;
        start: string;
        end: string;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    getElderSchedule(elderId: string): Promise<({
        scheduleItems: {
            id: string;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            createdAt: Date;
            updatedAt: Date;
            scheduleId: string;
            title: string;
            description: string | null;
            startTime: string;
            endTime: string;
        }[];
    } & {
        id: string;
        elderId: string;
        careRequestId: string | null;
        day: import(".prisma/client").$Enums.DayOfWeek;
        start: string;
        end: string;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    updateItemStatus(itemId: string, status: ScheduleStatus): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        createdAt: Date;
        updatedAt: Date;
        scheduleId: string;
        title: string;
        description: string | null;
        startTime: string;
        endTime: string;
    }>;
    deleteSchedule(scheduleId: string): Promise<{
        id: string;
        elderId: string;
        careRequestId: string | null;
        day: import(".prisma/client").$Enums.DayOfWeek;
        start: string;
        end: string;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteAllDaySchedules(elderId: string, day: DayOfWeek): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
