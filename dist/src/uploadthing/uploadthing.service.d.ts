export declare class UploadThingService {
    private utapi;
    constructor();
    uploadFile(file: Express.Multer.File): Promise<{
        key: string;
        url: string;
        name: string;
        size: number;
        type: string;
    }>;
    deleteFile(fileKey: string): Promise<{
        success: boolean;
    }>;
    deleteFiles(fileKeys: string[]): Promise<{
        success: boolean;
    }>;
    getFileUrl(fileKey: string): string;
    listFiles(limit?: number, offset?: number): Promise<{
        readonly files: readonly {
            readonly name: string;
            readonly size: number;
            readonly customId: string | null;
            readonly key: string;
            readonly id: string;
            readonly status: "Deletion Pending" | "Failed" | "Uploaded" | "Uploading";
            readonly uploadedAt: number;
        }[];
        readonly hasMore: boolean;
    }>;
}
