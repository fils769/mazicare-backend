import { ApiProperty } from '@nestjs/swagger';

export class CheckoutSessionResponseDto {
  @ApiProperty({ description: 'Identifier of the Stripe Checkout session' })
  sessionId: string;

  @ApiProperty({ description: 'URL the customer should be redirected to for payment' })
  checkoutUrl: string | null;
}
