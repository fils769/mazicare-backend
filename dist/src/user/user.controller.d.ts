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
    updateProfile(req: any, data: UpdateProfileDto): Promise<{
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
    updateProfilePicture(req: any, profilePicture?: Express.Multer.File): Promise<{
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
