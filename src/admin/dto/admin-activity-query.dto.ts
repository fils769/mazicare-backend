import { ApiPropertyOptional } from '@nestjs/swagger';
import { ActivityCategory } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class AdminActivityQueryDto {
  @ApiPropertyOptional({
    enum: ActivityCategory,
    description: 'Filter by activity category',
  })
  @IsOptional()
  @IsEnum(ActivityCategory)
  category?: ActivityCategory;

  @ApiPropertyOptional({ description: 'Filter by user identifier' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    description: 'ISO date string specifying start of range',
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  from?: Date;

  @ApiPropertyOptional({
    description: 'ISO date string specifying end of range',
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  to?: Date;

  @ApiPropertyOptional({
    description: 'Limit number of records returned',
    default: 100,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  limit?: number;
}
