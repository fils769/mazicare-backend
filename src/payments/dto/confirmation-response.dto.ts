import { ApiProperty } from '@nestjs/swagger';

export class PaymentConfirmationResponseDto {
  @ApiProperty({ description: 'Whether the payment confirmation completed successfully' })
  success: boolean;
}
