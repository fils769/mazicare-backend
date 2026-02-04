import { FamilyService } from './family.service';
import { UploadThingService } from '../uploadthing/uploadthing.service';
export declare class FamilyController {
    private familyService;
    private uploadThingService;
    constructor(familyService: FamilyService, uploadThingService: UploadThingService);
    saveOnboardingData(req: any, rawData: any, profilePicture?: Express.Multer.File): Promise<{
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
    private validateDto;
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
    completeOnboarding(req: any): Promise<{
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
    getProfileStatus(req: any): Promise<{
        completed: boolean;
        profileComplete: boolean;
        userId: string;
    }>;
    getOnboardingData(req: any): Promise<{}>;
    getElders(req: any): Promise<{
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
    registerElder(req: any, elderData: any, profilePicture?: Express.Multer.File): Promise<{
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
    updateElder(req: any, id: string, elderData: any): Promise<{
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
    removeElder(req: any, id: string): Promise<{
        success: boolean;
        message: string;
        elderId: string;
    }>;
    getFamilyRequests(req: any, elderId?: string): Promise<{
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
    getRequestStatus(req: any, requestId: string): Promise<{
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
}
export declare class FamiliesController {
    private familyService;
    constructor(familyService: FamilyService);
    searchFamilies(query: string, filters: any): Promise<{
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
