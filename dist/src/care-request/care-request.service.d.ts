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
    }>;
    acceptCareRequest(userId: string, requestId: string): Promise<{
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
    }>;
    private createSchedulesForAcceptedRequest;
    findAllForUser(userId: string): Promise<{
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
    }[]>;
    findOne(userId: string, requestId: string): Promise<{
        caregiver: {
            user: {
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.AccountStatus;
                updatedAt: Date;
                email: string;
                phoneNumber: string | null;
                password: string | null;
                role: import(".prisma/client").$Enums.UserRole;
                isVerified: boolean;
                phoneVerified: boolean;
                profilePicture: string | null;
            };
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
            residencePermit: string | null;
            isGreekResident: boolean | null;
            experience: number | null;
            onboardingComplete: boolean;
            stripeAccountId: string | null;
            languages: string[];
        };
        family: {
            user: {
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.AccountStatus;
                updatedAt: Date;
                email: string;
                phoneNumber: string | null;
                password: string | null;
                role: import(".prisma/client").$Enums.UserRole;
                isVerified: boolean;
                phoneVerified: boolean;
                profilePicture: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profilePicture: string | null;
            region: string | null;
            phone: string | null;
            onboardingComplete: boolean;
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
    }>;
    update(userId: string, requestId: string, dto: UpdateCareRequestDto): Promise<{
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
    }>;
    remove(userId: string, requestId: string): Promise<{
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
    }>;
    rejectCareRequest(userId: string, requestId: string): Promise<{
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
                createdAt: Date;
                status: import(".prisma/client").$Enums.AccountStatus;
                updatedAt: Date;
                email: string;
                phoneNumber: string | null;
                password: string | null;
                role: import(".prisma/client").$Enums.UserRole;
                isVerified: boolean;
                phoneVerified: boolean;
                profilePicture: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profilePicture: string | null;
            region: string | null;
            phone: string | null;
            onboardingComplete: boolean;
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
            status: import(".prisma/client").$Enums.ScheduleStatus;
            updatedAt: Date;
            elderId: string;
            day: import(".prisma/client").$Enums.DayOfWeek;
            start: string;
            end: string;
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
    })[]>;
    cancelCareRequest(userId: string, requestId: string, reason?: string): Promise<{
        message: string;
        data: {
            caregiver: {
                user: {
                    id: string;
                    createdAt: Date;
                    status: import(".prisma/client").$Enums.AccountStatus;
                    updatedAt: Date;
                    email: string;
                    phoneNumber: string | null;
                    password: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    isVerified: boolean;
                    phoneVerified: boolean;
                    profilePicture: string | null;
                };
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
                residencePermit: string | null;
                isGreekResident: boolean | null;
                experience: number | null;
                onboardingComplete: boolean;
                stripeAccountId: string | null;
                languages: string[];
            };
            family: {
                user: {
                    id: string;
                    createdAt: Date;
                    status: import(".prisma/client").$Enums.AccountStatus;
                    updatedAt: Date;
                    email: string;
                    phoneNumber: string | null;
                    password: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    isVerified: boolean;
                    phoneVerified: boolean;
                    profilePicture: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                profilePicture: string | null;
                region: string | null;
                phone: string | null;
                onboardingComplete: boolean;
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
        };
    }>;
    expirePendingRequests(): Promise<{
        message: string;
        details: PromiseSettledResult<{
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
        }>[];
    }>;
    getCancellableRequests(userId: string): Promise<({
        caregiver: {
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
            residencePermit: string | null;
            isGreekResident: boolean | null;
            experience: number | null;
            onboardingComplete: boolean;
            stripeAccountId: string | null;
            languages: string[];
        };
        family: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profilePicture: string | null;
            region: string | null;
            phone: string | null;
            onboardingComplete: boolean;
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
            status: import(".prisma/client").$Enums.ScheduleStatus;
            updatedAt: Date;
            elderId: string;
            day: import(".prisma/client").$Enums.DayOfWeek;
            start: string;
            end: string;
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
    })[]>;
}
