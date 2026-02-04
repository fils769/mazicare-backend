export declare class SaveDetailsDto {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    region?: string;
    regionId?: string;
    regionIds?: string[];
    bio?: string;
    phone?: string;
    email?: string;
    languages?: string[];
    idPassportPhoto?: string;
    recommendationLetter?: string;
    certificates?: string[];
}
export declare class RegionSelectionDto {
    regionId: string;
}
export declare class CareProgramDto {
    programIds: string[];
}
export declare class ElderRequestResponseDto {
    elderId: string;
}
export declare enum ScheduleStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED"
}
export declare class UpdateScheduleItemDto {
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    status?: ScheduleStatus;
}
