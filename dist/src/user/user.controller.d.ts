import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/user.dto';
import { UploadThingService } from '../uploadthing/uploadthing.service';
export declare class UserController {
    private userService;
    private uploadThingService;
    constructor(userService: UserService, uploadThingService: UploadThingService);
    getProfile(req: any): Promise<{
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
    updateProfile(req: any, data: UpdateProfileDto): Promise<{
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
    updateProfilePicture(req: any, profilePicture?: Express.Multer.File): Promise<{
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
