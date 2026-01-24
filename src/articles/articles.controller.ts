import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('articles')
@UseGuards(JwtAuthGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  async create(
    @Body() body: any,
    @UploadedFiles() images: Express.Multer.File[],
    @Request() req,
  ) {
    try {
      const createArticleDto = plainToClass(CreateArticleDto, {
        title: body.title,
        contentBlocks: JSON.parse(body.contentBlocks || '[]'),
      });

      const errors = await validate(createArticleDto);
      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }

      return this.articlesService.create(createArticleDto, images);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new BadRequestException('Invalid JSON in contentBlocks');
      }
      throw error;
    }
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.articlesService.findAll(pageNum, limitNum);
  }

  @Get('search')
  search(
    @Query('q') query: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.articlesService.search(query, pageNum, limitNum);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() images: Express.Multer.File[],
    @Request() req,
  ) {
    try {
      const updateArticleDto = plainToClass(UpdateArticleDto, {
        title: body.title,
        contentBlocks: JSON.parse(body.contentBlocks || '[]'),
      });

      const errors = await validate(updateArticleDto);
      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }

      return this.articlesService.update(id, updateArticleDto, images);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new BadRequestException('Invalid JSON in contentBlocks');
      }
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.articlesService.remove(id);
  }
}
