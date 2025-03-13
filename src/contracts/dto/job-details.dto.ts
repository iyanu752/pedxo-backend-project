import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class JobDetailsDto {
  @IsString()
  @IsOptional()
  roleTitle?: string;

  @IsString()
  @IsOptional()
  seniorityLevel?: string;

  @IsString()
  @IsNotEmpty()
  scopeOfWork: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsNotEmpty()
  explanationOfScopeOfWork: string;
}
