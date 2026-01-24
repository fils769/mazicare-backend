import { IsString, IsArray, ValidateNested, IsOptional, IsInt, IsIn, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class ContentBlockDataDto {
  text?: string;
  alt?: string;
  url?: string;
  items?: Array<{ id: string; text: string; order: number }>;
  style?: string;
  columns?: number[];
  children?: ContentBlockDto[];
  isFile?: boolean;
}

export class ContentBlockDto {
  @IsIn(['heading', 'subheading', 'paragraph', 'image', 'list', 'layout'])
  type: string;

  @IsInt()
  order: number;

  @IsOptional()
  data?: Record<string, any> | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  children?: ContentBlockDto[];
}

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  contentBlocks: ContentBlockDto[];
}