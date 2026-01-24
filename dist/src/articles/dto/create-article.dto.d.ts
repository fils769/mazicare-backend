export declare class ContentBlockDto {
    type: string;
    order: number;
    data?: Record<string, any> | null;
    children?: ContentBlockDto[];
}
export declare class CreateArticleDto {
    title: string;
    contentBlocks: ContentBlockDto[];
}
