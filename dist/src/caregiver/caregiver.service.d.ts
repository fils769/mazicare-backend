import { PrismaService } from '../prisma/prisma.service';
import { SaveDetailsDto, RegionSelectionDto, CareProgramDto, UpdateScheduleItemDto } from './dto/caregiver.dto';
export declare class CaregiverService {
    private prisma;
    constructor(prisma: PrismaService);
    saveDetails(userId: string, data: SaveDetailsDto, profilePicture?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        email: string | null;
        profilePicture: string | null;
        firstName: string | null;
        lastName: string | null;
        dateOfBirth: string | null;
        gender: string | null;
        region: string | null;
        bio: string | null;
        phone: string | null;
        regionId: string | null;
        documentUrl: string | null;
        idPassportPhoto: string | null;
        recommendationLetter: string | null;
        certificates: string[];
        experience: number | null;
        onboardingComplete: boolean;
        stripeAccountId: string | null;
        languages: string[];
    }>;
    getRegions(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }[]>;
    saveRegionSelection(userId: string, data: RegionSelectionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        email: string | null;
        profilePicture: string | null;
        firstName: string | null;
        lastName: string | null;
        dateOfBirth: string | null;
        gender: string | null;
        region: string | null;
        bio: string | null;
        phone: string | null;
        regionId: string | null;
        documentUrl: string | null;
        idPassportPhoto: string | null;
        recommendationLetter: string | null;
        certificates: string[];
        experience: number | null;
        onboardingComplete: boolean;
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
        name: string;
        createdAt: Date;
        description: string | null;
    }[]>;
    saveCareProgram(userId: string, data: CareProgramDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        email: string | null;
        profilePicture: string | null;
        firstName: string | null;
        lastName: string | null;
        dateOfBirth: string | null;
        gender: string | null;
        region: string | null;
        bio: string | null;
        phone: string | null;
        regionId: string | null;
        documentUrl: string | null;
        idPassportPhoto: string | null;
        recommendationLetter: string | null;
        certificates: string[];
        experience: number | null;
        onboardingComplete: boolean;
        stripeAccountId: string | null;
        languages: string[];
    }>;
    completeOnboarding(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        email: string | null;
        profilePicture: string | null;
        firstName: string | null;
        lastName: string | null;
        dateOfBirth: string | null;
        gender: string | null;
        region: string | null;
        bio: string | null;
        phone: string | null;
        regionId: string | null;
        documentUrl: string | null;
        idPassportPhoto: string | null;
        recommendationLetter: string | null;
        certificates: string[];
        experience: number | null;
        onboardingComplete: boolean;
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
                name: string;
                createdAt: Date;
                description: string | null;
            }[];
            caregiverRegion: {
                id: string;
                name: string;
                createdAt: Date;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            email: string | null;
            profilePicture: string | null;
            firstName: string | null;
            lastName: string | null;
            dateOfBirth: string | null;
            gender: string | null;
            region: string | null;
            bio: string | null;
            phone: string | null;
            regionId: string | null;
            documentUrl: string | null;
            idPassportPhoto: string | null;
            recommendationLetter: string | null;
            certificates: string[];
            experience: number | null;
            onboardingComplete: boolean;
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
        status: import(".prisma/client").$Enums.RequestStatus;
        updatedAt: Date;
        caregiverId: string;
        familyId: string;
        careType: import(".prisma/client").$Enums.CareType;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        requestedAt: Date;
        respondedAt: Date | null;
        expiresAt: Date | null;
        elderId: string;
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
                status: import(".prisma/client").$Enums.ScheduleStatus;
                updatedAt: Date;
                title: string;
                description: string | null;
                startTime: string;
                endTime: string;
                scheduleId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            updatedAt: Date;
            elderId: string;
            day: import(".prisma/client").$Enums.DayOfWeek;
            start: string;
            end: string;
            careRequestId: string | null;
        })[];
    }[]>;
    getElderSchedules(userId: string, elderId: string): Promise<{
        elderId: string;
        elderName: string;
        schedules: ({
            scheduleItems: {
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.ScheduleStatus;
                updatedAt: Date;
                title: string;
                description: string | null;
                startTime: string;
                endTime: string;
                scheduleId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            updatedAt: Date;
            elderId: string;
            day: import(".prisma/client").$Enums.DayOfWeek;
            start: string;
            end: string;
            careRequestId: string | null;
        })[];
    }>;
    updateScheduleItem(userId: string, itemId: string, data: UpdateScheduleItemDto): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        updatedAt: Date;
        title: string;
        description: string | null;
        startTime: string;
        endTime: string;
        scheduleId: string;
    }>;
    updateScheduleItemStatus(userId: string, itemId: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        updatedAt: Date;
        title: string;
        description: string | null;
        startTime: string;
        endTime: string;
        scheduleId: string;
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
}
