import { ActivityCategory } from '@prisma/client';
export declare class AdminActivityQueryDto {
    category?: ActivityCategory;
    userId?: string;
    from?: Date;
    to?: Date;
    limit?: number;
}
