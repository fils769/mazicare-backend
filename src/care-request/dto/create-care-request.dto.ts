// src/care-request/dto/create-care-request.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsArray, ArrayMinSize, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum CareType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export class CreateCareRequestDto {
  @IsString()
  @IsNotEmpty()
  elderId: string;

  @IsString()
  @IsNotEmpty()
  caregiverId: string;

  @IsEnum(CareType)
  careType: CareType;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one day must be selected for part-time care' })
  @IsEnum(DayOfWeek, { each: true })
  @IsOptional()
  careDays?: DayOfWeek[];
}