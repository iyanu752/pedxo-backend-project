import { ContractDocument } from '../schemas/contract.schema';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';


export class ContractEmailDto {
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  contractType:string;

  @IsOptional()
  @IsString()
  roleTitle?: string;

  @IsOptional()
  @IsString()
  seniorityLevel?: string;

  @IsString()
  @IsNotEmpty()
  scopeOfWork: string;

  @IsString()
  @IsNotEmpty()
  explanationOfScopeOfWork: string;

  @IsString()
  @IsNotEmpty()
  startDate: string; // Stored in YYYY-MM-DD format

  @IsOptional()
  @IsString()
  endDate?: string; // Stored in YYYY-MM-DD format

  @IsNumber()
  @IsNotEmpty()
  paymentRate: number;

  @IsNotEmpty()
  paymentFrequency: string;

  constructor(contract: ContractDocument) {
    if (contract) {
      this.clientName = contract.clientName;
      this.email = contract.email;
      this.country = contract.country;
      this.region = contract.region;
      this.companyName = contract.companyName;
      this.contractType = contract.contractType;
      this.roleTitle = contract.roleTitle;
      this.seniorityLevel = contract.seniorityLevel;
      this.scopeOfWork = contract.scopeOfWork;
      this.explanationOfScopeOfWork = contract.explanationOfScopeOfWork;
      this.startDate = contract.startDate.toISOString().split('T')[0];
      this.endDate = contract.endDate ? contract.endDate.toISOString().split('T')[0] : undefined;
      this.paymentRate = contract.paymentRate;
      this.paymentFrequency = contract.paymentFrequency;
    }
  }
}
