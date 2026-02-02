import { AdminService } from './admin.service';
import { AdminActivityQueryDto } from './dto/admin-activity-query.dto';
import { AdminUpdateElderDto } from './dto/update-elder.dto';
import { UpdateCaregiverStatusDto } from './dto/update-caregiver-status.dto';
import { AdminProfileQueryDto } from './dto/admin-profile-query.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getActivityLogs(query: AdminActivityQueryDto): Promise<any>;
    getFamilyAccounts(): Promise<{
        totalFamilies: number;
        withActiveSubscription: number;
        families: {
            id: string;
            familyName: string | null;
            user: {
                id: string;
                email: string;
                status: import(".prisma/client").$Enums.AccountStatus;
                createdAt: Date;
            };
            onboardingComplete: boolean;
            eldersCount: number;
            subscription: {
                id: string;
                planId: string;
                planName: string;
                status: import(".prisma/client").$Enums.SubscriptionStatus;
                startDate: Date;
                endDate: Date;
                price: number;
                progressPercent: number | null;
                daysRemaining: number | null;
            } | null;
        }[];
    }>;
    getCaregivers(): Promise<{
        id: string;
        userId: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
        phone: string | null;
        status: import(".prisma/client").$Enums.AccountStatus;
        gender: string | null;
        region: string | null;
        experience: number | null;
        languages: string[];
        bio: string | null;
        dateOfBirth: string | null;
        onboardingComplete: boolean;
        assignedElders: number;
        programs: string[];
        documents: {
            profilePicture: string | null;
            documentUrl: string | null;
            idPassportPhoto: string | null;
            recommendationLetter: string | null;
            certificates: {
                id: string;
                createdAt: Date;
                caregiverId: string;
                url: string;
            }[];
        };
        createdAt: Date;
    }[]>;
    getFeatureActivity(): Promise<{
        caregiving: any;
        onboarding: any;
        deals: any;
        raw: any;
    }>;
    getElders(): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        gender: import(".prisma/client").$Enums.Gender;
        dateOfBirth: Date;
        description: string | null;
        family: {
            id: string;
            familyName: string | null;
            email: string;
        } | null;
        caregiver: {
            id: string;
            name: string;
            email: string | null;
        } | null;
        program: {
            id: string;
            name: string;
        } | null;
        createdAt: Date;
    }[]>;
    updateElder(elderId: string, dto: AdminUpdateElderDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        profilePicture: string | null;
        firstName: string;
        lastName: string;
        dateOfBirth: Date;
        gender: import(".prisma/client").$Enums.Gender;
        familyId: string;
        description: string | null;
        programId: string | null;
    }>;
    deleteElder(elderId: string): Promise<{
        success: boolean;
        elderId: string;
    }>;
    updateCaregiverStatus(caregiverId: string, dto: UpdateCaregiverStatusDto): Promise<{
        success: boolean;
        caregiverId: string;
        userId: string;
        status: import(".prisma/client").$Enums.AccountStatus;
    }>;
    getSubscriptionActivity(limit?: number): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        category: import(".prisma/client").$Enums.ActivityCategory;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        actorRole: import(".prisma/client").$Enums.UserRole | null;
        eventType: string;
        entityType: string | null;
        entityId: string | null;
    }[]>;
    getProfile(query: AdminProfileQueryDto): Promise<{
        id: string;
        familyName: string | null;
        careFor: string | null;
        user: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.AccountStatus;
            email: string;
            subscription: ({
                plan: {
                    id: string;
                    name: string;
                    price: number;
                    features: string[];
                    duration: string;
                    stripePriceId: string | null;
                    createdAt: Date;
                };
            } & {
                id: string;
                price: number;
                createdAt: Date;
                status: import(".prisma/client").$Enums.SubscriptionStatus;
                startDate: Date;
                endDate: Date;
                updatedAt: Date;
                userId: string;
                planId: string;
            }) | null;
        };
        elders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            profilePicture: string | null;
            firstName: string;
            lastName: string;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
            familyId: string;
            description: string | null;
            programId: string | null;
        }[];
        createdAt: Date;
        updatedAt: Date;
        onboardingComplete: boolean;
        firstName?: undefined;
        lastName?: undefined;
        email?: undefined;
        phone?: undefined;
        gender?: undefined;
        region?: undefined;
        caregiverRegion?: undefined;
        programs?: undefined;
        experience?: undefined;
        bio?: undefined;
        languages?: undefined;
        documents?: undefined;
        dateOfBirth?: undefined;
        description?: undefined;
        family?: undefined;
        caregiver?: undefined;
        program?: undefined;
    } | {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
        gender: string | null;
        region: string | null;
        user: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.AccountStatus;
            email: string;
        };
        caregiverRegion: {
            name: string;
        } | null;
        programs: {
            name: string;
        }[];
        elders: {
            id: string;
            firstName: string;
            lastName: string;
        }[];
        onboardingComplete: boolean;
        experience: number | null;
        bio: string | null;
        languages: string[];
        documents: {
            profilePicture: string | null;
            documentUrl: string | null;
            idPassportPhoto: string | null;
            recommendationLetter: string | null;
            certificates: {
                id: string;
                createdAt: Date;
                caregiverId: string;
                url: string;
            }[];
        };
        createdAt: Date;
        familyName?: undefined;
        careFor?: undefined;
        updatedAt?: undefined;
        dateOfBirth?: undefined;
        description?: undefined;
        family?: undefined;
        caregiver?: undefined;
        program?: undefined;
    } | {
        id: string;
        firstName: string;
        lastName: string;
        gender: import(".prisma/client").$Enums.Gender;
        dateOfBirth: Date;
        description: string | null;
        family: {
            id: string;
            familyName: string | null;
        };
        caregiver: {
            id: string;
            name: string;
            email: string | null;
        } | null;
        program: {
            id: string;
            name: string;
        } | null;
        createdAt: Date;
        familyName?: undefined;
        careFor?: undefined;
        user?: undefined;
        elders?: undefined;
        updatedAt?: undefined;
        onboardingComplete?: undefined;
        email?: undefined;
        phone?: undefined;
        region?: undefined;
        caregiverRegion?: undefined;
        programs?: undefined;
        experience?: undefined;
        bio?: undefined;
        languages?: undefined;
        documents?: undefined;
    }>;
    getGenderCounts(): Promise<{
        caregivers: Record<string, number>;
        elders: Record<string, number>;
    }>;
    getReports(): Promise<{
        overview: {
            totalFamilies: number;
            activeFamilies: number;
            totalCaregivers: number;
            activeCaregivers: number;
            pendingCaregivers: number;
            totalElders: number;
            eldersWithCaregivers: number;
            totalConnections: number;
            activeSubscriptions: number;
        };
        careMetrics: {
            careCompletionRate: number;
            totalScheduleItems: number;
            completedScheduleItems: number;
            pendingScheduleItems: number;
        };
        matchingMetrics: {
            familiesWithCaregivers: number;
            familiesWithoutCaregivers: number;
            caregiversWithElders: number;
            caregiversWithoutElders: number;
            eldersWithCaregivers: number;
            eldersWithoutCaregivers: number;
            matchRate: number;
        };
        activity: {
            recentActivityCount: number;
            periodDays: number;
        };
        details: {
            activeFamilies: {
                id: string;
                name: string | null;
                email: string;
                status: import(".prisma/client").$Enums.AccountStatus;
            }[];
            activeCaregivers: {
                id: string;
                name: string;
                email: string;
                status: import(".prisma/client").$Enums.AccountStatus;
            }[];
            pendingCaregivers: {
                id: string;
                name: string;
                email: string;
                status: import(".prisma/client").$Enums.AccountStatus;
            }[];
            connections: {
                elderName: string;
                familyName: string | null;
                caregiverName: string;
            }[];
        };
    }>;
    getStripeBalance(): Promise<{
        stripe: {
            available: {
                amount: number;
                currency: string;
            }[];
            pending: {
                amount: number;
                currency: string;
            }[];
            livemode: boolean;
        };
        database: {
            totalRevenue: number;
            totalTransactions: number;
            subscriptionRevenue: number;
            subscriptionCount: number;
            caregiverPayouts: number;
            caregiverPayoutCount: number;
        };
        summary: {
            totalRevenue: number;
            stripeAvailable: number;
            stripePending: number;
            currency: string;
        };
    }>;
}
