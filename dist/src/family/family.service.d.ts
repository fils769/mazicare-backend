import { PrismaService } from '../prisma/prisma.service';
import { FamilyOnboardingDto } from './dto/family.dto';
export declare class FamilyService {
    private prisma;
    constructor(prisma: PrismaService);
    getFamilyRequests(userId: string, elderId?: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        requestedAt: Date;
        respondedAt: Date | null;
        elder: {
            id: string;
            name: string;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
        };
        caregiver: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
        } | null;
    }[]>;
    getRequestStatus(userId: string, requestId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.RequestStatus;
        requestedAt: Date;
        respondedAt: Date | null;
        elder: {
            id: string;
            name: string;
        };
        caregiver: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
        } | null;
        message: string;
    }>;
    private getStatusMessage;
    saveOnboardingData(userId: string, data: FamilyOnboardingDto, profilePicture?: string): Promise<{
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
    }>;
    getCaregivers(filters: any): Promise<{
        id: string;
        userId: string;
        name: string;
        email: string;
        phone: string | null;
        region: string | undefined;
        avatar: string | null;
        rating: number;
        reviewCount: number;
        experience: string;
        monthlyRate: number;
        availability: string;
        specialties: string[];
        distance: string;
    }[]>;
    getRegions(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
    }[]>;
    getLanguages(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
    }[]>;
    completeOnboarding(userId: string): Promise<{
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
    }>;
    getProfileStatus(userId: string): Promise<{
        completed: boolean;
        profileComplete: boolean;
        userId: string;
    }>;
    getOnboardingData(userId: string): Promise<{}>;
    getElders(userId: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        careProgram: string | null;
        careGiver: string | null;
        caregiverEmail: string | null;
        caregiverProfile: string | null;
        caregiverId: string | null;
        DOB: Date;
        Gender: string;
        description: string | null;
        profilePicture: string | null;
        familyId: string;
    }[]>;
    registerElder(userId: string, elderData: any, profilePicture?: string): Promise<{
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
    updateElder(userId: string, elderId: string, elderData: any): Promise<{
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
    removeElder(userId: string, elderId: string): Promise<{
        success: boolean;
        message: string;
        elderId: string;
    }>;
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
            age: number | null;
            gender: import(".prisma/client").$Enums.Gender;
            hasCaregiver: boolean;
        }[];
    }[]>;
}
