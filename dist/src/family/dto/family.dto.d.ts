export declare class FamilyOnboardingDto {
    familyName: string;
    careFor: string;
    ageGroup: string;
    region: string;
    language: string;
    phone?: string;
    careTypes: string[];
    schedule: string;
    daysHours: string;
    genderPreference: string;
    experienceLevel: string;
    backgroundCheck: boolean;
    profilePicture?: Express.Multer.File;
}
