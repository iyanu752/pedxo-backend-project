import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CompensationDto {
  @IsNumber()
  @IsNotEmpty()
  paymentRate: number;

  @IsString()
  @IsNotEmpty()
  paymentFrequency: string;
}
