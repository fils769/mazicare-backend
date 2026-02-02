import { ScheduleService } from './schedule.service';
import { CreateScheduleDto, UpdateScheduleDto, UpdateItemStatusDto, Day } from './dto/schedule.dto';
export declare class ScheduleController {
    private scheduleService;
    constructor(scheduleService: ScheduleService);
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
        careRequestId: string | null;
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
        careRequestId: string | null;
    })[]>;
    getDaySchedule(elderId: string, day: Day): Promise<({
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
        careRequestId: string | null;
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
        careRequestId: string | null;
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
        createdAt: Date;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        updatedAt: Date;
        elderId: string;
        day: import(".prisma/client").$Enums.DayOfWeek;
        start: string;
        end: string;
        careRequestId: string | null;
    }>;
    deleteAllDaySchedules(elderId: string, day: Day): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateItemStatus(itemId: string, statusData: UpdateItemStatusDto): Promise<{
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
}
