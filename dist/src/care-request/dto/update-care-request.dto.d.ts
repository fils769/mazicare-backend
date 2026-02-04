import { RequestStatus, DayOfWeek, CareType } from '@prisma/client';
export declare class UpdateCareRequestDto {
    status?: RequestStatus;
    careType?: CareType;
    careDays?: DayOfWeek[];
}
