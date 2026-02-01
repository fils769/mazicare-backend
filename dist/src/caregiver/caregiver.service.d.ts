import { PrismaService } from '../prisma/prisma.service';
import { SaveDetailsDto, RegionSelectionDto, CareProgramDto, UpdateScheduleItemDto } from './dto/caregiver.dto';
export declare class CaregiverService {
    private prisma;
    constructor(prisma: PrismaService);
    saveDetails(userId: string, data: SaveDetailsDto, profilePicture?: string): Promise<{
        id: string;
        userId: string;
        firstName: string | null;
        lastName: string | null;
        dateOfBirth: string | null;
        gender: string | null;
        region: string | null;
        bio: string | null;
        profilePicture: string | null;
        email: string | null;
        phone: string | null;
        regionId: string | null;
        documentUrl: string | null;
        idPassportPhoto: string | null;
        recommendationLetter: string | null;
        certificates: string[];
        experience: number | null;
        onboardingComplete: boolean;
        createdAt: Date;
        updatedAt: Date;
        stripeAccountId: string | null;
        languages: string[];
    }>;
    getRegions(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
    }[]>;
    saveRegionSelection(userId: string, data: RegionSelectionDto): Promise<{
        id: string;
        userId: string;
        firstName: string | null;
        lastName: string | null;
        dateOfBirth: string | null;
        gender: string | null;
        region: string | null;
        bio: string | null;
        profilePicture: string | null;
        email: string | null;
        phone: string | null;
        regionId: string | null;
        documentUrl: string | null;
        idPassportPhoto: string | null;
        recommendationLetter: string | null;
        certificates: string[];
        experience: number | null;
        onboardingComplete: boolean;
        createdAt: Date;
        updatedAt: Date;
        stripeAccountId: string | null;
        languages: string[];
    }>;
    uploadDocument(userId: string, documentUrl: string): Promise<{
        documentUrl: string | null;
    }>;
    uploadIdPassport(userId: string, idPassportPhoto: string): Promise<{
        idPassportPhoto: string | null;
    }>;
    uploadRecommendation(userId: string, recommendationLetter: string): Promise<{
        recommendationLetter: string | null;
    }>;
    uploadCertificate(userId: string, certificateUrl: string): Promise<{
        certificates: string[];
    }>;
    getCarePrograms(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
    }[]>;
    saveCareProgram(userId: string, data: CareProgramDto): Promise<{
        id: string;
        userId: string;
        firstName: string | null;
        lastName: string | null;
        dateOfBirth: string | null;
        gender: string | null;
        region: string | null;
        bio: string | null;
        profilePicture: string | null;
        email: string | null;
        phone: string | null;
        regionId: string | null;
        documentUrl: string | null;
        idPassportPhoto: string | null;
        recommendationLetter: string | null;
        certificates: string[];
        experience: number | null;
        onboardingComplete: boolean;
        createdAt: Date;
        updatedAt: Date;
        stripeAccountId: string | null;
        languages: string[];
    }>;
    completeOnboarding(userId: string): Promise<{
        id: string;
        userId: string;
        firstName: string | null;
        lastName: string | null;
        dateOfBirth: string | null;
        gender: string | null;
        region: string | null;
        bio: string | null;
        profilePicture: string | null;
        email: string | null;
        phone: string | null;
        regionId: string | null;
        documentUrl: string | null;
        idPassportPhoto: string | null;
        recommendationLetter: string | null;
        certificates: string[];
        experience: number | null;
        onboardingComplete: boolean;
        createdAt: Date;
        updatedAt: Date;
        stripeAccountId: string | null;
        languages: string[];
    }>;
    getOnboardingStatus(userId: string): Promise<{
        hasDetails: boolean;
        hasRegionSelection: boolean;
        hasDocument: boolean;
        hasIdPassport: boolean;
        hasRecommendation: boolean;
        hasCertificates: boolean;
        hasCareProgram: boolean;
        isComplete: boolean;
        caregiver?: undefined;
    } | {
        hasDetails: boolean;
        hasRegionSelection: boolean;
        hasDocument: boolean;
        hasIdPassport: boolean;
        hasRecommendation: boolean;
        hasCertificates: boolean;
        hasCareProgram: boolean;
        isComplete: boolean;
        caregiver: {
            programs: {
                id: string;
                createdAt: Date;
                name: string;
                description: string | null;
            }[];
            caregiverRegion: {
                id: string;
                createdAt: Date;
                name: string;
            } | null;
        } & {
            id: string;
            userId: string;
            firstName: string | null;
            lastName: string | null;
            dateOfBirth: string | null;
            gender: string | null;
            region: string | null;
            bio: string | null;
            profilePicture: string | null;
            email: string | null;
            phone: string | null;
            regionId: string | null;
            documentUrl: string | null;
            idPassportPhoto: string | null;
            recommendationLetter: string | null;
            certificates: string[];
            experience: number | null;
            onboardingComplete: boolean;
            createdAt: Date;
            updatedAt: Date;
            stripeAccountId: string | null;
            languages: string[];
        };
    }>;
    searchCaregivers(filters: any): Promise<{
        id: string;
        name: string;
        avatar: string | null;
        rating: number;
        experience: string;
        region: string;
        languages: string[];
    }[]>;
    getCaregiverProfile(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        avatar: string | null;
        rating: number;
        experience: string;
        region: string | undefined;
        programs: string[];
        bio: string;
        languages: string[];
    }>;
    getCaregiverReviews(id: string): Promise<{
        id: string;
        rating: number;
        comment: string | null;
        reviewerName: string;
        date: Date;
    }[]>;
    assignCaregiver(caregiverId: string, elderId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        caregiverId: string;
        elderId: string;
        familyId: string;
        careType: import(".prisma/client").$Enums.CareType;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        requestedAt: Date;
        respondedAt: Date | null;
        expiresAt: Date | null;
    } | {
        success: boolean;
        message: string;
        request: {
            id: string;
            caregiverId: string;
            elderId: string;
            status: string;
            requestedAt: Date;
            elder: {
                id: string;
                name: string;
            };
            caregiver: {
                id: string;
                name: string;
                email: string;
            };
        };
    }>;
    private updateExistingRequest;
    getMyCaregiverProfile(userId: string): Promise<{
        id: string;
        firstName: string | null;
        lastName: string | null;
        name: string;
        email: string;
        phone: string | null;
        avatar: string | null;
        bio: string | null;
        rating: number;
        reviewCount: number;
        experience: number | null;
        region: string | undefined;
        programs: string[];
        elderCount: number;
        onboardingComplete: boolean;
        languages: string[];
        documents: {
            profilePicture: string | null;
            idPassportPhoto: string | null;
            recommendationLetter: string | null;
            certificates: string[];
            documentUrl: string | null;
        };
    }>;
    getMyElders(userId: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        name: string;
        dateOfBirth: Date;
        gender: import(".prisma/client").$Enums.Gender;
        description: string | null;
        profilePicture: string | null;
        familyName: string | null;
        careProgram: string | undefined;
        scheduleCount: number;
    }[]>;
    getMyElderCount(userId: string): Promise<{
        count: number;
    }>;
    getMyRating(userId: string): Promise<{
        averageRating: number;
        totalReviews: number;
        reviews: {
            createdAt: Date;
            rating: number;
            comment: string | null;
        }[];
    }>;
    getMySchedules(userId: string): Promise<{
        elderId: string;
        elderName: string;
        schedules: ({
            scheduleItems: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                status: import(".prisma/client").$Enums.ScheduleStatus;
                startTime: string;
                scheduleId: string;
                title: string;
                endTime: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            elderId: string;
            careRequestId: string | null;
            day: import(".prisma/client").$Enums.DayOfWeek;
            start: string;
            end: string;
        })[];
    }[]>;
    getElderSchedules(userId: string, elderId: string): Promise<{
        elderId: string;
        elderName: string;
        schedules: ({
            scheduleItems: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                status: import(".prisma/client").$Enums.ScheduleStatus;
                startTime: string;
                scheduleId: string;
                title: string;
                endTime: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            elderId: string;
            careRequestId: string | null;
            day: import(".prisma/client").$Enums.DayOfWeek;
            start: string;
            end: string;
        })[];
    }>;
    updateScheduleItem(userId: string, itemId: string, data: UpdateScheduleItemDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        startTime: string;
        scheduleId: string;
        title: string;
        endTime: string;
    }>;
    updateScheduleItemStatus(userId: string, itemId: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        startTime: string;
        scheduleId: string;
        title: string;
        endTime: string;
    }>;
    getElderRequests(userId: string): Promise<{
        requestId: string;
        elderId: string;
        firstName: string;
        lastName: string;
        name: string;
        dateOfBirth: Date;
        gender: import(".prisma/client").$Enums.Gender;
        description: string | null;
        profilePicture: string | null;
        familyName: string | null;
        familyEmail: string;
        familyRegion: string | null;
        careProgram: string | undefined;
        requestedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
    }[]>;
    searchFamilies(filters: any): Promise<{
        id: string;
        userId: string;
        name: string;
        email: string;
        profilePicture: string | null;
        region: string | null;
        careFor: string | null;
        ageGroup: string | null;
        language: string | null;
        careTypes: string[];
        elderCount: number;
        elders: {
            id: string;
            name: string;
            hasCaregiver: boolean;
        }[];
    }[]>;
    getActivity(userId: string, period: string): Promise<{
        period: string;
        periodLabel: string;
        overallStats: {
            totalElders: number;
            totalTasks: number;
            completedTasks: number;
            pendingTasks: number;
            activeTasks: number;
            avgCompletionRate: number;
            totalWeeklyHours: number;
        };
        activeElders: {
            count: number;
            list: {
                id: string;
                firstName: string;
                lastName: string;
                fullName: string;
                age: number;
                gender: import(".prisma/client").$Enums.Gender;
                profilePicture: string | null;
                program: {
                    name: string;
                    description: string | null;
                } | null;
                activeDays: import(".prisma/client").$Enums.DayOfWeek[];
                weeklyHours: number;
                upcomingTasks: {
                    id: string;
                    title: string;
                    startTime: string;
                    endTime: string;
                    status: import(".prisma/client").$Enums.ScheduleStatus;
                    scheduleDay: import(".prisma/client").$Enums.DayOfWeek;
                }[];
                stats: {
                    recentCompleted: number;
                    totalSchedules: number;
                    totalUpcomingTasks: number;
                    completionRate: number;
                };
                careRequestId: string;
                joinedDate: Date;
            }[];
            summary: {
                totalWeeklyHours: number;
                avgCompletionRate: number;
                eldersWithUpcomingTasks: number;
            };
        };
        tasks: {
            summary: {
                total: number;
                completed: number;
                pending: number;
                active: number;
                completionRate: number;
            };
        };
    }>;
}
