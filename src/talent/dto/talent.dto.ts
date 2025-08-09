import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEmail,
  IsDate,
  // isEnum,
} from 'class-validator';
import {
  ExperiencedLevel,
  JobNatureNeeded,
  MySkills,
  WorkPattern,
} from '../enum/talent.enum';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
// import { Exclude } from 'class-transformer';

export class CreateTalentDto {
  @IsOptional()
  @IsString()
  twitterLink: string;

  @IsOptional()
  @IsString()
  linkedIn: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsNumber()
  zipCode: number;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsEnum(MySkills, { each: true })
  skills: string[];

  @IsNotEmpty()
  @IsEnum(ExperiencedLevel)
  experiencedLevel: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsEnum(WorkPattern, { each: true })
  workPattern: string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsEnum(JobNatureNeeded, { each: true })
  jobNature: string[];

  @IsString()
  @IsOptional()
  yearOfExperienceInSales?: string;

  @IsString()
  @IsOptional()
  studentType?: string;

  @IsString()
  @IsOptional()
  nameOfSchoolOrBootCamp?: string;

  @IsString()
  @IsOptional()
  graduationDate: string[];

  @IsOptional()
  @IsString()
  image?: object;
}

export class CreateTalentDetailsDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  roleTitle: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  bankName: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @IsNotEmpty()
  @IsEnum(ExperiencedLevel)
  experienceLevel: string;

  @IsOptional()
  @IsString()
  githubAccount: string;

  @IsNotEmpty()
  @IsString()
  portfolioLink: string;

  @IsNotEmpty()
  @IsString()
  whatsappNumber: string;
}

export class UpdateDetailsDto extends PartialType(CreateTalentDetailsDto) {}

export class UpdateDto extends PartialType(CreateTalentDto) {}
