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
        createdAt: Date;
        status: import(".prisma/client").$Enums.AccountStatus;
        updatedAt: Date;
        email: string;
        phoneNumber: string | null;
        isVerified: boolean;
        phoneVerified: boolean;
        profilePicture: string | null;
    } | {
        role: "CAREGIVER" | "FAMILY";
        displayName: string | null;
        profile: any;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AccountStatus;
        updatedAt: Date;
        email: string;
        phoneNumber: string | null;
        isVerified: boolean;
        phoneVerified: boolean;
        profilePicture: string | null;
    }>;
    updateProfile(userId: string, data: UpdateProfileDto): Promise<{
        role: "ADMIN";
        displayName: string;
        profile: {
            profilePicture: string | null;
        };
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AccountStatus;
        updatedAt: Date;
        email: string;
        phoneNumber: string | null;
        isVerified: boolean;
        phoneVerified: boolean;
        profilePicture: string | null;
    } | {
        role: "CAREGIVER" | "FAMILY";
        displayName: string | null;
        profile: any;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AccountStatus;
        updatedAt: Date;
        email: string;
        phoneNumber: string | null;
        isVerified: boolean;
        phoneVerified: boolean;
        profilePicture: string | null;
    }>;
    updateProfilePicture(userId: string, profilePictureUrl: string): Promise<{
        role: "ADMIN";
        displayName: string;
        profile: {
            profilePicture: string | null;
        };
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AccountStatus;
        updatedAt: Date;
        email: string;
        phoneNumber: string | null;
        isVerified: boolean;
        phoneVerified: boolean;
        profilePicture: string | null;
    } | {
        role: "CAREGIVER" | "FAMILY";
        displayName: string | null;
        profile: any;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.AccountStatus;
        updatedAt: Date;
        email: string;
        phoneNumber: string | null;
        isVerified: boolean;
        phoneVerified: boolean;
        profilePicture: string | null;
    }>;
}
