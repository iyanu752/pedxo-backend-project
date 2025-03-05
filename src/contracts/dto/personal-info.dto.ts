import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PersonalInfoDto {
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  region?: string;
}
