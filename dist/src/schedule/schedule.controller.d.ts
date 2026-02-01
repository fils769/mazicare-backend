import { ScheduleService } from './schedule.service';
import { CreateScheduleDto, UpdateScheduleDto, UpdateItemStatusDto, Day } from './dto/schedule.dto';
export declare class ScheduleController {
    private scheduleService;
    constructor(scheduleService: ScheduleService);
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
    getDaySchedule(elderId: string, day: Day): Promise<({
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
    createSchedule(elderId: string, scheduleData: CreateScheduleDto): Promise<{
        id: string;
        elderId: string;
        day: import(".prisma/client").DayOfWeek;
        start: string;
        end: string;
        careRequestId: string | null;
        scheduleItems: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").ScheduleStatus;
            title: string;
            startTime: string;
            endTime: string;
            scheduleId: string;
        }[];
    }[]>;
    updateSchedule(elderId: string, scheduleData: UpdateScheduleDto): Promise<any[]>;
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
    deleteAllDaySchedules(elderId: string, day: Day): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateItemStatus(itemId: string, statusData: UpdateItemStatusDto): Promise<{
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
}
