// src/care-request/dto/update-care-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus, DayOfWeek, CareType } from '@prisma/client';

export class UpdateCareRequestDto {
  @ApiProperty({ enum: RequestStatus, required: false })
  status?: RequestStatus;

  @ApiProperty({ enum: CareType, required: false })
  careType?: CareType;

  @ApiProperty({ type: [String], enum: DayOfWeek, required: false })
  careDays?: DayOfWeek[];
}
