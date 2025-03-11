import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
  Get, 
  Param,
  Patch,
  BadRequestException,
  UseGuards,
  Req
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateContextOptions } from 'node:vm';
import { CreateOptions } from 'mongoose';
import { ContractService } from './contract.service';
import { PersonalInfoDto } from './dto/personal-info.dto';
import { JobDetailsDto } from './dto/job-details.dto';
import { CompensationDto } from './dto/compensation.dto';
import { SignatureDto } from './dto/signature.dto';
import { JWTAuthGuard } from 'src/auth/customGuard/jwt.guard';
import {S3Service} from "../s3service/s3service.service"
const fileFilter = (req, file, callback) => {
  // Allowed mime types
  const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];

  if (!allowedTypes.includes(file.mimetype)) {
    return callback(new BadRequestException('Only PNG, JPEG, and SVG files are allowed'), false);
  }

  callback(null, true);
};

const uploadOptions = {
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
  fileFilter,
};

@Controller('contracts')
export class ContractController {
  constructor(
    private readonly contractService: ContractService,
    private readonly  s3service: S3Service
  ) {}

  @UseGuards(JWTAuthGuard)
  @Post('personal-info')
  createOrUpdatePersonalInfo(@Body() dto: PersonalInfoDto) {
    return this.contractService.createOrUpdatePersonalInfo(dto);
  }

  @UseGuards(JWTAuthGuard)
  @Patch('job-details')
  updateJobDetails(@Req() req, @Body() dto: JobDetailsDto) {
    let email  = req.user.email
    return this.contractService.updateJobDetails(email, dto);
  }

  @UseGuards(JWTAuthGuard)
  @Patch('compensation')
  updateCompensation(@Req() req, @Body() dto: CompensationDto) {
    let email  = req.user.email
    return this.contractService.updateCompensation(email, dto);
  }

  @UseGuards(JWTAuthGuard)
  @Post('signature')
  @UseInterceptors(FileInterceptor('signature', uploadOptions))
  async uploadSignature(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    let email  = req.user.email

    const data = await this.contractService.submitSignature(email,file);
    return { data};
  }
  @UseGuards(JWTAuthGuard)
  @Patch('finalize')
  finalizeContract(@Req() req) {
    let email  = req.user.email
    return this.contractService.finalizeContract(email);
  }

  @UseGuards(JWTAuthGuard)
  @Get(':email')
  getContract(@Param('email') email: string) {
    return this.contractService.getContract(email);
  }


}
