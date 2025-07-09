import {
  IsCurrency,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BuildSomePart, WantTalentAs, WorkStartDate } from '../enum/hire.enum';

export class HireDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  whereYouLive: string;

  @IsString()
  @IsNotEmpty()
  state: string;
  @IsString()
  @IsNotEmpty()
  country: string;
  //role)

  @IsString()
  YourTitle: string;
  ///enum
  @IsEnum(BuildSomePart)
  haveYouBuildSomePart: BuildSomePart;
  //enum
  @IsEnum(WorkStartDate)
  workStartDate: WorkStartDate;

  //enum
  @IsEnum(WantTalentAs)
  wantTalentAs: WantTalentAs;

  //background
  @IsString()
  paymentPattern: string;

  @IsString()
  yourCurrentJob: string;

  // @IsNumber()
  @IsCurrency()
  minimumToPayToTalent: string;
  @IsOptional()
  @IsString()
  website: string;
  @IsOptional()
  @IsString()
  githubLink: string;

  @IsOptional()
  @IsString()
  linkedIn: string;
  @IsOptional()
  @IsString()
  twitterLink: string;
}
