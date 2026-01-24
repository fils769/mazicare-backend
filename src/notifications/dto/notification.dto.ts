import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ description: 'Notification title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Notification message body' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Notification type' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({
    description:
      'Explicit recipient identifier (defaults to authenticated user)',
  })
  @IsOptional()
  @IsString()
  recipientId?: string;
}
