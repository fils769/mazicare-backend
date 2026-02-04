import { Gender } from '@prisma/client';
export declare class AdminUpdateElderDto {
    firstName?: string;
    lastName?: string;
    careGiverId?: string;
    programId?: string;
    description?: string;
    gender?: Gender;
    dateOfBirth?: string;
}
