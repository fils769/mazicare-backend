export declare enum Day {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}
export declare enum ScheduleStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED"
}
export declare class ScheduleItemDto {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    status?: ScheduleStatus;
}
export declare class ScheduleDto {
    day: Day;
    scheduleItems: ScheduleItemDto[];
}
export declare class CreateScheduleDto {
    elderId: string;
    schedules: ScheduleDto[];
}
export declare class UpdateScheduleDto {
    schedules?: ScheduleDto[];
}
export declare class ScheduleItemResponse {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    status: ScheduleStatus;
}
export declare class ScheduleResponse {
    day: Day;
    start: string;
    end: string;
    scheduleItems: ScheduleItemResponse[];
}
export declare class WeekScheduleResponse {
    elderId: string;
    elderName: string;
    weekStart: string;
    weekEnd: string;
    schedules: ScheduleResponse[];
}
export declare class UpdateItemStatusDto {
    status: ScheduleStatus;
}
