import { IsString, IsNotEmpty, IsInt, Min, Max, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateReviewDto {
    @ApiProperty({
        description: 'ID of the caregiver being reviewed',
        example: 'cuid_123456789',
    })
    @IsString()
    @IsNotEmpty()
    caregiverId: string;

    @ApiProperty({
        description: 'Rating from 1 to 5',
        example: 5,
        minimum: 1,
        maximum: 5,
    })
    @IsInt()
    @Min(1)
    @Max(5)
    @Type(() => Number)
    rating: number;

    @ApiPropertyOptional({
        description: 'Optional comment or feedback',
        example: 'Great service, very punctual and kind.',
    })
    @IsString()
    @IsOptional()
    comment?: string;
}
