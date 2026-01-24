import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, IsUrl } from 'class-validator';

export class CreateCaregiverCheckoutDto {
  @ApiProperty({ description: 'Caregiver identifier receiving the payout' })
  @IsString()
  caregiverId: string;

  @ApiProperty({
    description:
      'Amount to transfer to the caregiver (in major currency units)',
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Currency ISO code (default usd)',
    default: 'usd',
  })
  @IsString()
  currency: string = 'usd';

  @ApiProperty({ description: 'URL to redirect after successful payment' })
  @IsUrl()
  successUrl: string;

  @ApiProperty({
    description: 'URL to redirect if the payer cancels the payment',
  })
  @IsUrl()
  cancelUrl: string;
}
