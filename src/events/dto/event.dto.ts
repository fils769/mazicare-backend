import { IsOptional, IsString } from 'class-validator';

export class EventFiltersDto {
  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  category?: string;
}