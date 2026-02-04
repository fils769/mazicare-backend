import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UploadThingService } from '../uploadthing/uploadthing.service';
export declare class ArticlesService {
    private prisma;
    private uploadThingService;
    constructor(prisma: PrismaService, uploadThingService: UploadThingService);
    create(createArticleDto: CreateArticleDto, files?: Express.Multer.File[]): Promise<({
        blocks: ({
            children: {
                id: string;
                data: import("@prisma/client/runtime/library").JsonValue;
                type: string;
                order: number;
                parentId: string | null;
                articleId: string;
            }[];
        } & {
            id: string;
            data: import("@prisma/client/runtime/library").JsonValue;
            type: string;
            order: number;
            parentId: string | null;
            articleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
    }) | null>;
    findAll(page?: number, limit?: number): Promise<{
        data: ({
            blocks: ({
                children: {
                    id: string;
                    data: import("@prisma/client/runtime/library").JsonValue;
                    type: string;
                    order: number;
                    parentId: string | null;
                    articleId: string;
                }[];
            } & {
                id: string;
                data: import("@prisma/client/runtime/library").JsonValue;
                type: string;
                order: number;
                parentId: string | null;
                articleId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    search(query: string, page?: number, limit?: number): Promise<{
        data: ({
            blocks: ({
                children: {
                    id: string;
                    data: import("@prisma/client/runtime/library").JsonValue;
                    type: string;
                    order: number;
                    parentId: string | null;
                    articleId: string;
                }[];
            } & {
                id: string;
                data: import("@prisma/client/runtime/library").JsonValue;
                type: string;
                order: number;
                parentId: string | null;
                articleId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<({
        blocks: ({
            children: {
                id: string;
                data: import("@prisma/client/runtime/library").JsonValue;
                type: string;
                order: number;
                parentId: string | null;
                articleId: string;
            }[];
        } & {
            id: string;
            data: import("@prisma/client/runtime/library").JsonValue;
            type: string;
            order: number;
            parentId: string | null;
            articleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
    }) | null>;
    update(id: string, updateArticleDto: UpdateArticleDto, files?: Express.Multer.File[]): Promise<({
        blocks: ({
            children: {
                id: string;
                data: import("@prisma/client/runtime/library").JsonValue;
                type: string;
                order: number;
                parentId: string | null;
                articleId: string;
            }[];
        } & {
            id: string;
            data: import("@prisma/client/runtime/library").JsonValue;
            type: string;
            order: number;
            parentId: string | null;
            articleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
    }) | null>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
    }>;
    private createBlocksWithArticleId;
    private processContentBlockImages;
    private countImageFiles;
}
