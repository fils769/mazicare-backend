import { CareRequestService } from './care-request.service';
import { CreateCareRequestDto } from './dto/create-care-request.dto';
import { UpdateCareRequestDto } from './dto/update-care-request.dto';
import { RemoveCaregiverRelationDto } from './dto/remove-caregiver-relation.dto';
export declare class CareRequestController {
    private readonly careRequestService;
    constructor(careRequestService: CareRequestService);
    create(req: any, createCareRequestDto: CreateCareRequestDto): Promise<{
        id: string;
        elderId: string;
        caregiverId: string;
        familyId: string;
        careType: import(".prisma/client").$Enums.CareType;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.RequestStatus;
        requestedAt: Date;
        respondedAt: Date | null;
        expiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(req: any): Promise<{
        id: string;
        elderId: string;
        caregiverId: string;
        familyId: string;
        careType: import(".prisma/client").$Enums.CareType;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.RequestStatus;
        requestedAt: Date;
        respondedAt: Date | null;
        expiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string, req: any): Promise<{
        caregiver: {
            user: {
                id: string;
                status: import(".prisma/client").$Enums.AccountStatus;
                createdAt: Date;
                updatedAt: Date;
                profilePicture: string | null;
                email: string;
                phoneNumber: string | null;
                password: string | null;
                role: import(".prisma/client").$Enums.UserRole;
                isVerified: boolean;
                phoneVerified: boolean;
            };
        } & {
            region: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            profilePicture: string | null;
            phone: string | null;
            onboardingComplete: boolean;
            firstName: string | null;
            lastName: string | null;
            dateOfBirth: string | null;
            gender: string | null;
            bio: string | null;
            email: string | null;
            regionId: string | null;
            documentUrl: string | null;
            idPassportPhoto: string | null;
            recommendationLetter: string | null;
            certificates: string[];
            experience: number | null;
            stripeAccountId: string | null;
            languages: string[];
        };
        family: {
            user: {
                id: string;
                status: import(".prisma/client").$Enums.AccountStatus;
                createdAt: Date;
                updatedAt: Date;
                profilePicture: string | null;
                email: string;
                phoneNumber: string | null;
                password: string | null;
                role: import(".prisma/client").$Enums.UserRole;
                isVerified: boolean;
                phoneVerified: boolean;
            };
        } & {
            region: string | null;
            language: string | null;
            schedule: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            familyName: string | null;
            careFor: string | null;
            ageGroup: string | null;
            profilePicture: string | null;
            phone: string | null;
            careTypes: string[];
            daysHours: string | null;
            genderPreference: string | null;
            experienceLevel: string | null;
            backgroundCheck: boolean;
            onboardingComplete: boolean;
        };
    } & {
        id: string;
        elderId: string;
        caregiverId: string;
        familyId: string;
        careType: import(".prisma/client").$Enums.CareType;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.RequestStatus;
        requestedAt: Date;
        respondedAt: Date | null;
        expiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, req: any, updateCareRequestDto: UpdateCareRequestDto): Promise<{
        id: string;
        elderId: string;
        caregiverId: string;
        familyId: string;
        careType: import(".prisma/client").$Enums.CareType;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.RequestStatus;
        requestedAt: Date;
        respondedAt: Date | null;
        expiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        elderId: string;
        caregiverId: string;
        familyId: string;
        careType: import(".prisma/client").$Enums.CareType;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.RequestStatus;
        requestedAt: Date;
        respondedAt: Date | null;
        expiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    accept(id: string, req: any): Promise<{
        id: string;
        elderId: string;
        caregiverId: string;
        familyId: string;
        careType: import(".prisma/client").$Enums.CareType;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.RequestStatus;
        requestedAt: Date;
        respondedAt: Date | null;
        expiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    reject(id: string, req: any): Promise<{
        id: string;
        elderId: string;
        caregiverId: string;
        familyId: string;
        careType: import(".prisma/client").$Enums.CareType;
        careDays: import(".prisma/client").$Enums.DayOfWeek[];
        status: import(".prisma/client").$Enums.RequestStatus;
        requestedAt: Date;
        respondedAt: Date | null;
        expiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeCaregiverFromFamily(caregiverId: string, removeDto: RemoveCaregiverRelationDto, req: any): Promise<{
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
    removeFamilyFromCaregiver(caregiverId: string, removeDto: RemoveCaregiverRelationDto, req: any): Promise<{
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
    cancel(id: string, req: any): Promise<{
        message: string;
        data: {
            caregiver: {
                user: {
                    id: string;
                    status: import(".prisma/client").$Enums.AccountStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    profilePicture: string | null;
                    email: string;
                    phoneNumber: string | null;
                    password: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    isVerified: boolean;
                    phoneVerified: boolean;
                };
            } & {
                region: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                profilePicture: string | null;
                phone: string | null;
                onboardingComplete: boolean;
                firstName: string | null;
                lastName: string | null;
                dateOfBirth: string | null;
                gender: string | null;
                bio: string | null;
                email: string | null;
                regionId: string | null;
                documentUrl: string | null;
                idPassportPhoto: string | null;
                recommendationLetter: string | null;
                certificates: string[];
                experience: number | null;
                stripeAccountId: string | null;
                languages: string[];
            };
            family: {
                user: {
                    id: string;
                    status: import(".prisma/client").$Enums.AccountStatus;
                    createdAt: Date;
                    updatedAt: Date;
                    profilePicture: string | null;
                    email: string;
                    phoneNumber: string | null;
                    password: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    isVerified: boolean;
                    phoneVerified: boolean;
                };
            } & {
                region: string | null;
                language: string | null;
                schedule: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                familyName: string | null;
                careFor: string | null;
                ageGroup: string | null;
                profilePicture: string | null;
                phone: string | null;
                careTypes: string[];
                daysHours: string | null;
                genderPreference: string | null;
                experienceLevel: string | null;
                backgroundCheck: boolean;
                onboardingComplete: boolean;
            };
            elder: {
                id: string;
                familyId: string;
                createdAt: Date;
                updatedAt: Date;
                profilePicture: string | null;
                firstName: string;
                lastName: string;
                dateOfBirth: Date;
                gender: import(".prisma/client").$Enums.Gender;
                programId: string | null;
                description: string | null;
            };
        } & {
            id: string;
            elderId: string;
            caregiverId: string;
            familyId: string;
            careType: import(".prisma/client").$Enums.CareType;
            careDays: import(".prisma/client").$Enums.DayOfWeek[];
            status: import(".prisma/client").$Enums.RequestStatus;
            requestedAt: Date;
            respondedAt: Date | null;
            expiresAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
