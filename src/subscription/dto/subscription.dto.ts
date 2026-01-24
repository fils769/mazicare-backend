import { IsString } from 'class-validator';

export class RenewSubscriptionDto {
  @IsString()
  planId: string;
}