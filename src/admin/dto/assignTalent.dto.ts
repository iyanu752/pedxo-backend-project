import { IsArray, IsString } from 'class-validator';

export class assignTalaentDto {
  @IsArray()
  @IsString({ each: true })
  talentIds: string[];
  @IsString()
  contractId: string;
}
