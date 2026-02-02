import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsInt,
  IsMongoId,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';

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
export class DeleteContractDto {
  @IsMongoId()
  contractId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  performanceRating: number;

  @IsString()
  @IsNotEmpty()
  terminationReason: string;
}
