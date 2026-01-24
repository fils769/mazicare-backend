import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSubscriptionCheckoutDto {
  @ApiProperty({
    description: 'Identifier of the subscription plan to purchase',
  })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({
    description:
      'URL the customer will be redirected to after successful payment',
    example: 'http://localhost:8080/subscription?success=true',
  })
  @IsString()
  @IsNotEmpty()
  successUrl: string;

  @ApiProperty({
    description:
      'URL the customer will be redirected to if they cancel the payment flow',
    example: 'http://localhost:8080/subscription?canceled=true',
  })
  @IsString()
  @IsNotEmpty()
  cancelUrl: string;
}
