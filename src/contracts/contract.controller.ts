import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
  Get, 
  Param,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateContextOptions } from 'node:vm';
import { CreateOptions } from 'mongoose';
import { ContractService } from './contract.service';
import { PersonalInfoDto } from './dto/personal-info.dto';
import { JobDetailsDto } from './dto/job-details.dto';
import { CompensationDto } from './dto/compensation.dto';
import { SignatureDto } from './dto/signature.dto';

@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post('personal-info')
  createOrUpdatePersonalInfo(@Body() dto: PersonalInfoDto) {
    return this.contractService.createOrUpdatePersonalInfo(dto);
  }

  @Patch('job-details/:email')
  updateJobDetails(@Param('email') email: string, @Body() dto: JobDetailsDto) {
    return this.contractService.updateJobDetails(email, dto);
  }

  @Patch('compensation/:email')
  updateCompensation(@Param('email') email: string, @Body() dto: CompensationDto) {
    return this.contractService.updateCompensation(email, dto);
  }

  @Patch('signature')
  submitSignature(@Body() dto: SignatureDto) {
    return this.contractService.submitSignature(dto);
  }

  @Patch('finalize/:email')
  finalizeContract(@Param('email') email: string) {
    return this.contractService.finalizeContract(email);
  }

  @Get(':email')
  getContract(@Param('email') email: string) {
    return this.contractService.getContract(email);
  }

  // @Post('create/contract')
  // @UseInterceptors(FileInterceptor('signature')) // 'signature' is the form field name
  // async createUser(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() contractDetails:contractCreateDto,
  // ) {
  //   return this.contractService.createContract(file, contractDetails);
  // }
}
