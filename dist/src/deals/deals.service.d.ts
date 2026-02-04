import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../activity/activity-log.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { GetDealsQueryDto } from './dto/get-deals-query.dto';
export declare class DealsService {
    private readonly prisma;
    private readonly activityLogService;
    constructor(prisma: PrismaService, activityLogService: ActivityLogService);
    create(createDealDto: CreateDealDto, createdBy?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        region: string | null;
        title: string;
        description: string | null;
        category: string | null;
        discountPercent: number | null;
        price: number | null;
        imageUrl: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
        createdBy: string | null;
        redirectUrl: string | null;
    }>;
    findAll(query: GetDealsQueryDto): Promise<{
        deals: {
            claimsCount: number;
            _count: undefined;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            region: string | null;
            title: string;
            description: string | null;
            category: string | null;
            discountPercent: number | null;
            price: number | null;
            imageUrl: string | null;
            startsAt: Date | null;
            endsAt: Date | null;
            createdBy: string | null;
            redirectUrl: string | null;
        }[];
        total: number;
        limit: number;
        offset: number;
    }>;
    findOne(id: string, userId?: string): Promise<{
        claimsCount: number;
        isClaimed: boolean;
        _count: undefined;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        region: string | null;
        title: string;
        description: string | null;
        category: string | null;
        discountPercent: number | null;
        price: number | null;
        imageUrl: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
        createdBy: string | null;
        redirectUrl: string | null;
    }>;
    update(id: string, updateDealDto: UpdateDealDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        region: string | null;
        title: string;
        description: string | null;
        category: string | null;
        discountPercent: number | null;
        price: number | null;
        imageUrl: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
        createdBy: string | null;
        redirectUrl: string | null;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    claimDeal(dealId: string, userId: string, userRole?: string): Promise<{
        deal: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            region: string | null;
            title: string;
            description: string | null;
            category: string | null;
            discountPercent: number | null;
            price: number | null;
            imageUrl: string | null;
            startsAt: Date | null;
            endsAt: Date | null;
            createdBy: string | null;
            redirectUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        dealId: string;
    }>;
    getUserClaims(userId: string): Promise<({
        deal: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            region: string | null;
            title: string;
            description: string | null;
            category: string | null;
            discountPercent: number | null;
            price: number | null;
            imageUrl: string | null;
            startsAt: Date | null;
            endsAt: Date | null;
            createdBy: string | null;
            redirectUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        dealId: string;
    })[]>;
    getDealClaims(dealId: string): Promise<{
        deal: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            region: string | null;
            title: string;
            description: string | null;
            category: string | null;
            discountPercent: number | null;
            price: number | null;
            imageUrl: string | null;
            startsAt: Date | null;
            endsAt: Date | null;
            createdBy: string | null;
            redirectUrl: string | null;
        };
        claims: {
            id: string;
            userId: string;
            claimedAt: Date;
            user: {
                email: string;
                role: import(".prisma/client").$Enums.UserRole;
                name: string;
            };
        }[];
        totalClaims: number;
    }>;
}
