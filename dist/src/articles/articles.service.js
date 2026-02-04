"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const uploadthing_service_1 = require("../uploadthing/uploadthing.service");
let ArticlesService = class ArticlesService {
    prisma;
    uploadThingService;
    constructor(prisma, uploadThingService) {
        this.prisma = prisma;
        this.uploadThingService = uploadThingService;
    }
    async create(createArticleDto, files) {
        const { title, contentBlocks } = createArticleDto;
        const processedBlocks = await this.processContentBlockImages(contentBlocks, files);
        const article = await this.prisma.article.create({
            data: { title },
        });
        await this.createBlocksWithArticleId(processedBlocks, article.id);
        return this.prisma.article.findUnique({
            where: { id: article.id },
            include: {
                blocks: {
                    include: {
                        children: true,
                    },
                    orderBy: { order: 'asc' },
                },
            },
        });
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [articles, total] = await Promise.all([
            this.prisma.article.findMany({
                include: {
                    blocks: {
                        include: {
                            children: {
                                orderBy: { order: 'asc' },
                            },
                        },
                        where: { parentId: null },
                        orderBy: { order: 'asc' },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.article.count(),
        ]);
        return {
            data: articles,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async search(query, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [articles, total] = await Promise.all([
            this.prisma.article.findMany({
                where: {
                    title: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
                include: {
                    blocks: {
                        include: {
                            children: {
                                orderBy: { order: 'asc' },
                            },
                        },
                        where: { parentId: null },
                        orderBy: { order: 'asc' },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.article.count({
                where: {
                    title: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
            }),
        ]);
        return {
            data: articles,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        return this.prisma.article.findUnique({
            where: { id },
            include: {
                blocks: {
                    include: {
                        children: {
                            orderBy: { order: 'asc' },
                        },
                    },
                    where: { parentId: null },
                    orderBy: { order: 'asc' },
                },
            },
        });
    }
    async update(id, updateArticleDto, files) {
        const article = await this.prisma.article.findUnique({
            where: { id },
        });
        const processedBlocks = await this.processContentBlockImages(updateArticleDto.contentBlocks, files);
        await this.prisma.contentBlock.deleteMany({
            where: { articleId: id },
        });
        await this.prisma.article.update({
            where: { id },
            data: { title: updateArticleDto.title },
        });
        await this.createBlocksWithArticleId(processedBlocks, id);
        return this.prisma.article.findUnique({
            where: { id },
            include: {
                blocks: {
                    include: {
                        children: true,
                    },
                    orderBy: { order: 'asc' },
                },
            },
        });
    }
    async remove(id) {
        const article = await this.prisma.article.findUnique({
            where: { id },
        });
        return this.prisma.article.delete({
            where: { id },
        });
    }
    async createBlocksWithArticleId(blocks, articleId, parentId) {
        for (const block of blocks) {
            const createdBlock = await this.prisma.contentBlock.create({
                data: {
                    type: block.type,
                    order: block.order,
                    data: block.data,
                    articleId,
                    parentId,
                },
            });
            if (block.children && block.children.length > 0) {
                await this.createBlocksWithArticleId(block.children, articleId, createdBlock.id);
            }
        }
    }
    async processContentBlockImages(blocks, files) {
        if (!files || files.length === 0)
            return blocks;
        const processedBlocks = [];
        let fileIndex = 0;
        for (const block of blocks) {
            const processedBlock = { ...block };
            if (block.type === 'image' && block.data?.isFile && fileIndex < files.length) {
                const uploadResult = await this.uploadThingService.uploadFile(files[fileIndex]);
                processedBlock.data = {
                    ...block.data,
                    url: uploadResult.url,
                    isFile: false,
                };
                fileIndex++;
            }
            if (block.type === 'layout' && block.children) {
                const remainingFiles = files ? files.slice(fileIndex) : undefined;
                processedBlock.children = await this.processContentBlockImages(block.children, remainingFiles);
                fileIndex += this.countImageFiles(block.children);
            }
            processedBlocks.push(processedBlock);
        }
        return processedBlocks;
    }
    countImageFiles(blocks) {
        let count = 0;
        for (const block of blocks) {
            if (block.type === 'image' && block.data?.isFile) {
                count++;
            }
            if (block.children) {
                count += this.countImageFiles(block.children);
            }
        }
        return count;
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        uploadthing_service_1.UploadThingService])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map