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
  IsArray,
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

  @IsOptional()
  @IsArray()
  removeTalentIds?: string[];
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
