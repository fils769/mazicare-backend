import { PrismaService } from '../prisma/prisma.service';
import { CreateCareRequestDto } from './dto/create-care-request.dto';
import { UpdateCareRequestDto } from './dto/update-care-request.dto';
export declare class CareRequestService {
    private prisma;
    private readonly defaultScheduleItems;
    constructor(prisma: PrismaService);
    createCareRequest(userId: string, dto: CreateCareRequestDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        caregiverId: string;
        familyId: string;
        requestedAt: Date;
        respondedAt: Date | null;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        careType: import(".prisma/client").$Enums.CareType;
        expiresAt: Date | null;
        elderId: string;
    }>;
    acceptCareRequest(userId: string, requestId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        caregiverId: string;
        familyId: string;
        requestedAt: Date;
        respondedAt: Date | null;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        careType: import(".prisma/client").$Enums.CareType;
        expiresAt: Date | null;
        elderId: string;
    }>;
    private createSchedulesForAcceptedRequest;
    findAllForUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        caregiverId: string;
        familyId: string;
        requestedAt: Date;
        respondedAt: Date | null;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        careType: import(".prisma/client").$Enums.CareType;
        expiresAt: Date | null;
        elderId: string;
    }[]>;
    findOne(userId: string, requestId: string): Promise<{
        caregiver: {
            user: {
                id: string;
                email: string;
                phoneNumber: string | null;
                password: string | null;
                isVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                role: import(".prisma/client").$Enums.UserRole;
                status: import(".prisma/client").$Enums.AccountStatus;
                profilePicture: string | null;
                phoneVerified: boolean;
            };
        } & {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            profilePicture: string | null;
            userId: string;
            firstName: string | null;
            lastName: string | null;
            dateOfBirth: string | null;
            gender: string | null;
            bio: string | null;
            documentUrl: string | null;
            experience: number | null;
            onboardingComplete: boolean;
            phone: string | null;
            stripeAccountId: string | null;
            languages: string[];
            region: string | null;
            regionId: string | null;
            idPassportPhoto: string | null;
            recommendationLetter: string | null;
            isGreekResident: boolean | null;
            residencePermit: string | null;
        };
        family: {
            user: {
                id: string;
                email: string;
                phoneNumber: string | null;
                password: string | null;
                isVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                role: import(".prisma/client").$Enums.UserRole;
                status: import(".prisma/client").$Enums.AccountStatus;
                profilePicture: string | null;
                phoneVerified: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            profilePicture: string | null;
            userId: string;
            onboardingComplete: boolean;
            phone: string | null;
            region: string | null;
            familyName: string | null;
            careFor: string | null;
            ageGroup: string | null;
            language: string | null;
            careTypes: string[];
            schedule: string | null;
            daysHours: string | null;
            genderPreference: string | null;
            experienceLevel: string | null;
            backgroundCheck: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        caregiverId: string;
        familyId: string;
        requestedAt: Date;
        respondedAt: Date | null;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        careType: import(".prisma/client").$Enums.CareType;
        expiresAt: Date | null;
        elderId: string;
    }>;
    update(userId: string, requestId: string, dto: UpdateCareRequestDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        caregiverId: string;
        familyId: string;
        requestedAt: Date;
        respondedAt: Date | null;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        careType: import(".prisma/client").$Enums.CareType;
        expiresAt: Date | null;
        elderId: string;
    }>;
    remove(userId: string, requestId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        caregiverId: string;
        familyId: string;
        requestedAt: Date;
        respondedAt: Date | null;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        careType: import(".prisma/client").$Enums.CareType;
        expiresAt: Date | null;
        elderId: string;
    }>;
    rejectCareRequest(userId: string, requestId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        caregiverId: string;
        familyId: string;
        requestedAt: Date;
        respondedAt: Date | null;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        careType: import(".prisma/client").$Enums.CareType;
        expiresAt: Date | null;
        elderId: string;
    }>;
    removeCaregiverFromFamily(caregiverId: string, elderId: string, reason?: string, actorId?: string): Promise<{
        message: string;
        details: {
            caregiver: {
                id: string;
                name: string;
            };
            family: {
                id: string;
                name: string | null;
            };
            careRequestsCancelled: number;
            schedulesDeleted: number;
            scheduleItemsDeleted: number;
            reason: string | undefined;
        };
    }>;
    removeFamilyFromCaregiver(caregiverUserId: string, familyId: string, reason?: string, actorId?: string): Promise<{
        message: string;
        details: {
            caregiver: {
                id: string;
                name: string;
            };
            family: {
                id: string;
                name: string | null;
            };
            careRequestsCancelled: number;
            schedulesDeleted: number;
            scheduleItemsDeleted: number;
            reason: string | undefined;
        };
    }>;
    getCaregiverRelationships(caregiverId: string): Promise<({
        family: {
            user: {
                id: string;
                email: string;
                phoneNumber: string | null;
                password: string | null;
                isVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                role: import(".prisma/client").$Enums.UserRole;
                status: import(".prisma/client").$Enums.AccountStatus;
                profilePicture: string | null;
                phoneVerified: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            profilePicture: string | null;
            userId: string;
            onboardingComplete: boolean;
            phone: string | null;
            region: string | null;
            familyName: string | null;
            careFor: string | null;
            ageGroup: string | null;
            language: string | null;
            careTypes: string[];
            schedule: string | null;
            daysHours: string | null;
            genderPreference: string | null;
            experienceLevel: string | null;
            backgroundCheck: boolean;
        };
        schedules: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            elderId: string;
            start: string;
            end: string;
            day: import(".prisma/client").$Enums.DayOfWeek;
            careRequestId: string | null;
        }[];
        elder: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        caregiverId: string;
        familyId: string;
        requestedAt: Date;
        respondedAt: Date | null;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        careType: import(".prisma/client").$Enums.CareType;
        expiresAt: Date | null;
        elderId: string;
    })[]>;
    cancelCareRequest(userId: string, requestId: string, reason?: string): Promise<{
        message: string;
        data: {
            caregiver: {
                user: {
                    id: string;
                    email: string;
                    phoneNumber: string | null;
                    password: string | null;
                    isVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    role: import(".prisma/client").$Enums.UserRole;
                    status: import(".prisma/client").$Enums.AccountStatus;
                    profilePicture: string | null;
                    phoneVerified: boolean;
                };
            } & {
                id: string;
                email: string | null;
                createdAt: Date;
                updatedAt: Date;
                profilePicture: string | null;
                userId: string;
                firstName: string | null;
                lastName: string | null;
                dateOfBirth: string | null;
                gender: string | null;
                bio: string | null;
                documentUrl: string | null;
                experience: number | null;
                onboardingComplete: boolean;
                phone: string | null;
                stripeAccountId: string | null;
                languages: string[];
                region: string | null;
                regionId: string | null;
                idPassportPhoto: string | null;
                recommendationLetter: string | null;
                isGreekResident: boolean | null;
                residencePermit: string | null;
            };
            family: {
                user: {
                    id: string;
                    email: string;
                    phoneNumber: string | null;
                    password: string | null;
                    isVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    role: import(".prisma/client").$Enums.UserRole;
                    status: import(".prisma/client").$Enums.AccountStatus;
                    profilePicture: string | null;
                    phoneVerified: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                profilePicture: string | null;
                userId: string;
                onboardingComplete: boolean;
                phone: string | null;
                region: string | null;
                familyName: string | null;
                careFor: string | null;
                ageGroup: string | null;
                language: string | null;
                careTypes: string[];
                schedule: string | null;
                daysHours: string | null;
                genderPreference: string | null;
                experienceLevel: string | null;
                backgroundCheck: boolean;
            };
            elder: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.RequestStatus;
            caregiverId: string;
            familyId: string;
            requestedAt: Date;
            respondedAt: Date | null;
            careDays: import(".prisma/client").$Enums.DayOfWeek[];
            careType: import(".prisma/client").$Enums.CareType;
            expiresAt: Date | null;
            elderId: string;
        };
    }>;
    expirePendingRequests(): Promise<{
        message: string;
        details: PromiseSettledResult<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.RequestStatus;
            caregiverId: string;
            familyId: string;
            requestedAt: Date;
            respondedAt: Date | null;
            careDays: import(".prisma/client").$Enums.DayOfWeek[];
            careType: import(".prisma/client").$Enums.CareType;
            expiresAt: Date | null;
            elderId: string;
        }>[];
    }>;
    getCancellableRequests(userId: string): Promise<({
        caregiver: {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            profilePicture: string | null;
            userId: string;
            firstName: string | null;
            lastName: string | null;
            dateOfBirth: string | null;
            gender: string | null;
            bio: string | null;
            documentUrl: string | null;
            experience: number | null;
            onboardingComplete: boolean;
            phone: string | null;
            stripeAccountId: string | null;
            languages: string[];
            region: string | null;
            regionId: string | null;
            idPassportPhoto: string | null;
            recommendationLetter: string | null;
            isGreekResident: boolean | null;
            residencePermit: string | null;
        };
        family: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            profilePicture: string | null;
            userId: string;
            onboardingComplete: boolean;
            phone: string | null;
            region: string | null;
            familyName: string | null;
            careFor: string | null;
            ageGroup: string | null;
            language: string | null;
            careTypes: string[];
            schedule: string | null;
            daysHours: string | null;
            genderPreference: string | null;
            experienceLevel: string | null;
            backgroundCheck: boolean;
        };
        schedules: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            elderId: string;
            start: string;
            end: string;
            day: import(".prisma/client").$Enums.DayOfWeek;
            careRequestId: string | null;
        }[];
        elder: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RequestStatus;
        caregiverId: string;
        familyId: string;
        requestedAt: Date;
        respondedAt: Date | null;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        careType: import(".prisma/client").$Enums.CareType;
        expiresAt: Date | null;
        elderId: string;
    })[]>;
}
