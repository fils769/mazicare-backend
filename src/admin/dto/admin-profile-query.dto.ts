import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export enum AdminProfileType {
  FAMILY = 'family',
  ELDER = 'elder',
  CAREGIVER = 'caregiver',
}

export class AdminProfileQueryDto {
  @ApiProperty({
    enum: AdminProfileType,
    description: 'Profile type to retrieve',
  })
  @IsEnum(AdminProfileType)
  type: AdminProfileType;

  @ApiProperty({ description: 'Entity identifier' })
  @IsString()
  id: string;
}
