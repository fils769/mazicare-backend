import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    generateFamilyReport(userId: string): Promise<{
        reportId: string;
        userId: string;
        familyId: string;
        familyName: string | null;
        generatedAt: Date;
        summary: {
            totalElders: number;
            eldersWithCaregivers: number;
            eldersWithoutCaregivers: number;
            activeCaregivers: number;
            totalScheduleItems: any;
            completedScheduleItems: any;
            pendingScheduleItems: any;
            completionRate: number;
        };
        subscription: {
            planName: string;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            startDate: Date;
            endDate: Date;
            daysRemaining: number;
        } | null;
        requests: {
            total: number;
            pending: number;
            accepted: number;
            rejected: number;
            recent: {
                id: string;
                status: import(".prisma/client").$Enums.RequestStatus;
                elderName: string;
                caregiverName: string;
                createdAt: Date;
            }[];
        };
        elders: {
            id: string;
            name: string;
            age: number | null;
            gender: import(".prisma/client").$Enums.Gender;
            program: string | null;
            caregiver: {
                id: string;
                name: string;
                email: string | null;
                phone: string | null;
            } | null;
            hasCaregiver: boolean;
        }[];
    }>;
    generateCaregiverReport(userId: string): Promise<{
        reportId: string;
        userId: string;
        caregiverId: string;
        caregiverName: string;
        generatedAt: Date;
        profile: {
            email: string;
            phone: string | null;
            status: import(".prisma/client").$Enums.AccountStatus;
            gender: string | null;
            region: string | null;
            programs: string[];
            experience: number | null;
            onboardingComplete: boolean;
        };
        summary: {
            totalElders: number;
            activeFamilies: number;
            totalScheduleItems: any;
            completedScheduleItems: any;
            pendingScheduleItems: any;
            completionRate: number;
        };
        ratings: {
            averageRating: number;
            totalReviews: any;
        };
        requests: {
            total: number;
            pending: number;
            accepted: number;
            rejected: number;
            recent: {
                id: string;
                status: import(".prisma/client").$Enums.RequestStatus;
                familyName: string | null;
                elderName: string;
                createdAt: Date;
            }[];
        };
        elders: {
            id: string;
            name: string;
            age: number | null;
            gender: import(".prisma/client").$Enums.Gender;
            program: string | null;
            family: {
                id: string;
                name: string | null;
                email: string;
            };
        }[];
    }>;
}
