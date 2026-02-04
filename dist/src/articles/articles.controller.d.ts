import { ArticlesService } from './articles.service';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    create(body: any, images: Express.Multer.File[], req: any): Promise<({
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
    findAll(page?: string, limit?: string): Promise<{
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
    search(query: string, page?: string, limit?: string): Promise<{
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
    update(id: string, body: any, images: Express.Multer.File[], req: any): Promise<({
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
    remove(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
    }>;
}
