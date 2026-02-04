import { CareRequestService } from './care-request.service';
import { CreateCareRequestDto } from './dto/create-care-request.dto';
import { UpdateCareRequestDto } from './dto/update-care-request.dto';
import { RemoveCaregiverRelationDto } from './dto/remove-caregiver-relation.dto';
export declare class CareRequestController {
    private readonly careRequestService;
    constructor(careRequestService: CareRequestService);
    create(req: any, createCareRequestDto: CreateCareRequestDto): Promise<{
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
    findAll(req: any): Promise<{
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
    findOne(id: string, req: any): Promise<{
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
    update(id: string, req: any, updateCareRequestDto: UpdateCareRequestDto): Promise<{
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
    remove(id: string, req: any): Promise<{
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
    accept(id: string, req: any): Promise<{
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
    reject(id: string, req: any): Promise<{
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
}
