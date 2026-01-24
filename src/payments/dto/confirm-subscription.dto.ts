import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmCheckoutDto {
  @ApiProperty({
    description: 'Stripe Checkout Session identifier returned after payment',
  })
  @IsString()
  sessionId: string;
}
