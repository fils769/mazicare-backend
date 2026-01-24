import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UploadThingService } from '../uploadthing/uploadthing.service';

@Injectable()
export class ArticlesService {
  constructor(
    private prisma: PrismaService,
    private uploadThingService: UploadThingService,
  ) {}

  async create(createArticleDto: CreateArticleDto, files?: Express.Multer.File[]) {
    const { title, contentBlocks } = createArticleDto;

    // Process images in content blocks
    const processedBlocks = await this.processContentBlockImages(contentBlocks as any[], files);

    // First create the article
    const article = await this.prisma.article.create({
      data: { title },
    });

    // Then create all blocks with the articleId
    await this.createBlocksWithArticleId(processedBlocks, article.id);

    // Return the article with blocks
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

  async findAll(page: number = 1, limit: number = 10) {
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

  async search(query: string, page: number = 1, limit: number = 10) {
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

  async findOne(id: string) {
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

  async update(id: string, updateArticleDto: UpdateArticleDto, files?: Express.Multer.File[]) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    // Process images in content blocks
    const processedBlocks = await this.processContentBlockImages(updateArticleDto.contentBlocks as any, files);

    // Delete existing blocks and create new ones
    await this.prisma.contentBlock.deleteMany({
      where: { articleId: id },
    });

    // Update article title
    await this.prisma.article.update({
      where: { id },
      data: { title: updateArticleDto.title },
    });

    // Create new blocks
    await this.createBlocksWithArticleId(processedBlocks, id);

    // Return updated article with blocks
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

  async remove(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      
    });

    return this.prisma.article.delete({
      where: { id },
    });
  }

  private async createBlocksWithArticleId(blocks: any[], articleId: string, parentId?: string): Promise<void> {
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

      // Create children if they exist
      if (block.children && block.children.length > 0) {
        await this.createBlocksWithArticleId(block.children as any[], articleId, createdBlock.id);
      }
    }
  }

  private async processContentBlockImages(blocks: any[], files?: Express.Multer.File[]): Promise<any[]> {
    if (!files || files.length === 0) return blocks;

    const processedBlocks: any[] = [];
    let fileIndex = 0;

    for (const block of blocks) {
      const processedBlock = { ...block };

      // Handle image blocks
      if (block.type === 'image' && block.data?.isFile && fileIndex < files.length) {
        const uploadResult = await this.uploadThingService.uploadFile(files[fileIndex]);
        processedBlock.data = {
          ...block.data,
          url: uploadResult.url,
          isFile: false,
        };
        fileIndex++;
      }

      // Handle layout blocks with image children
      if (block.type === 'layout' && block.children) {
        const remainingFiles = files ? files.slice(fileIndex) : undefined;
        processedBlock.children = await this.processContentBlockImages(block.children as any[], remainingFiles);
        // Update fileIndex based on processed children
        fileIndex += this.countImageFiles(block.children as any[]);
      }

      processedBlocks.push(processedBlock);
    }

    return processedBlocks;
  }

  private countImageFiles(blocks: any[]): number {
    let count = 0;
    for (const block of blocks) {
      if (block.type === 'image' && block.data?.isFile) {
        count++;
      }
      if (block.children) {
        count += this.countImageFiles(block.children as any[]);
      }
    }
    return count;
  }
}
