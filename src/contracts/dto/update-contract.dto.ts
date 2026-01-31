import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class UpdateContractDto {
  @IsOptional()
  @IsString()
  contractType?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsString()
  roleTitle?: string;

  @IsOptional()
  @IsString()
  seniorityLevel?: string;

  @IsOptional()
  @IsString()
  scopeOfWork?: string;

  @IsOptional()
  @IsNumber()
  paymentRate?: number;

  @IsOptional()
  @IsString()
  paymentFrequency?: string;
}
