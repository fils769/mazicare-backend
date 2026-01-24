export declare enum CareType {
    FULL_TIME = "FULL_TIME",
    PART_TIME = "PART_TIME"
}
export declare enum DayOfWeek {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}
export declare class CreateCareRequestDto {
    elderId: string;
    caregiverId: string;
    careType: CareType;
    careDays?: DayOfWeek[];
}
