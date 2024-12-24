import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContractService } from './contract.service';
import { CreateContextOptions } from 'node:vm';
import { CreateOptions } from 'mongoose';
import { contractCreateDto } from './dto/contract.dto';
@Controller('')
export class ContractController {
  constructor(private readonly userService: ContractService) {}

  @Post('create/contract')
  @UseInterceptors(FileInterceptor('signature')) // 'signature' is the form field name
  async createUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() contractDetails:contractCreateDto,
  ) {
    return this.userService.createContract(file, contractDetails);
  }
}
