import { IsString, IsOptional } from 'class-validator';

export class RemoveCaregiverRelationDto {
  @IsString()
  familyId: string;

  @IsString()
  @IsOptional()
  reason?: string; 
}