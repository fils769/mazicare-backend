import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { GetDealsQueryDto } from './dto/get-deals-query.dto';
export declare class DealsController {
    private readonly dealsService;
    constructor(dealsService: DealsService);
    create(createDealDto: CreateDealDto, req: any): Promise<{
        id: string;
        price: number | null;
        createdAt: Date;
        updatedAt: Date;
        region: string | null;
        title: string;
        description: string | null;
        category: string | null;
        discountPercent: number | null;
        imageUrl: string | null;
        redirectUrl: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
        createdBy: string | null;
    }>;
    findAll(query: GetDealsQueryDto): Promise<{
        deals: {
            claimsCount: number;
            _count: undefined;
            id: string;
            price: number | null;
            createdAt: Date;
            updatedAt: Date;
            region: string | null;
            title: string;
            description: string | null;
            category: string | null;
            discountPercent: number | null;
            imageUrl: string | null;
            redirectUrl: string | null;
            startsAt: Date | null;
            endsAt: Date | null;
            createdBy: string | null;
        }[];
        total: number;
        limit: number;
        offset: number;
    }>;
    getUserClaims(req: any): Promise<({
        deal: {
            id: string;
            price: number | null;
            createdAt: Date;
            updatedAt: Date;
            region: string | null;
            title: string;
            description: string | null;
            category: string | null;
            discountPercent: number | null;
            imageUrl: string | null;
            redirectUrl: string | null;
            startsAt: Date | null;
            endsAt: Date | null;
            createdBy: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        dealId: string;
    })[]>;
    findOne(id: string, req: any): Promise<{
        claimsCount: number;
        isClaimed: boolean;
        _count: undefined;
        id: string;
        price: number | null;
        createdAt: Date;
        updatedAt: Date;
        region: string | null;
        title: string;
        description: string | null;
        category: string | null;
        discountPercent: number | null;
        imageUrl: string | null;
        redirectUrl: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
        createdBy: string | null;
    }>;
    getDealClaims(id: string): Promise<{
        deal: {
            id: string;
            price: number | null;
            createdAt: Date;
            updatedAt: Date;
            region: string | null;
            title: string;
            description: string | null;
            category: string | null;
            discountPercent: number | null;
            imageUrl: string | null;
            redirectUrl: string | null;
            startsAt: Date | null;
            endsAt: Date | null;
            createdBy: string | null;
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
    update(id: string, updateDealDto: UpdateDealDto): Promise<{
        id: string;
        price: number | null;
        createdAt: Date;
        updatedAt: Date;
        region: string | null;
        title: string;
        description: string | null;
        category: string | null;
        discountPercent: number | null;
        imageUrl: string | null;
        redirectUrl: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
        createdBy: string | null;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    claimDeal(id: string, req: any): Promise<{
        deal: {
            id: string;
            price: number | null;
            createdAt: Date;
            updatedAt: Date;
            region: string | null;
            title: string;
            description: string | null;
            category: string | null;
            discountPercent: number | null;
            imageUrl: string | null;
            redirectUrl: string | null;
            startsAt: Date | null;
            endsAt: Date | null;
            createdBy: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        dealId: string;
    }>;
}
