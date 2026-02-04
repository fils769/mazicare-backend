import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/user.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        role: "ADMIN";
        displayName: string;
        profile: {
            profilePicture: string | null;
        };
        id: string;
        email: string;
        phoneNumber: string | null;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AccountStatus;
        profilePicture: string | null;
        phoneVerified: boolean;
    } | {
        role: "CAREGIVER" | "FAMILY";
        displayName: string | null;
        profile: any;
        id: string;
        email: string;
        phoneNumber: string | null;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AccountStatus;
        profilePicture: string | null;
        phoneVerified: boolean;
    }>;
    updateProfile(userId: string, data: UpdateProfileDto): Promise<{
        role: "ADMIN";
        displayName: string;
        profile: {
            profilePicture: string | null;
        };
        id: string;
        email: string;
        phoneNumber: string | null;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AccountStatus;
        profilePicture: string | null;
        phoneVerified: boolean;
    } | {
        role: "CAREGIVER" | "FAMILY";
        displayName: string | null;
        profile: any;
        id: string;
        email: string;
        phoneNumber: string | null;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AccountStatus;
        profilePicture: string | null;
        phoneVerified: boolean;
    }>;
    updateProfilePicture(userId: string, profilePictureUrl: string): Promise<{
        role: "ADMIN";
        displayName: string;
        profile: {
            profilePicture: string | null;
        };
        id: string;
        email: string;
        phoneNumber: string | null;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AccountStatus;
        profilePicture: string | null;
        phoneVerified: boolean;
    } | {
        role: "CAREGIVER" | "FAMILY";
        displayName: string | null;
        profile: any;
        id: string;
        email: string;
        phoneNumber: string | null;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AccountStatus;
        profilePicture: string | null;
        phoneVerified: boolean;
    }>;
}
