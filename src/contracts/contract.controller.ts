import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
  Get,
  Patch,
  BadRequestException,
  UseGuards,
  Req,
  // InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContractService } from './contract.service';
import { PersonalInfoDto } from './dto/personal-info.dto';
import { JobDetailsDto } from './dto/job-details.dto';
import { CompensationDto } from './dto/compensation.dto';
import { JWTAuthGuard } from 'src/auth/customGuard/jwt.guard';
import { CloudinaryService } from '../s3service/s3service.service';
import { ApiConsumes } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/customGuard/admin-auth.guard';

// const fileFilter = (req, file, callback) => {
//   const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
//   if (!allowedTypes.includes(file.mimetype)) {
//     return callback(
//       new BadRequestException('Only PNG, JPEG, and SVG files are allowed'),
//       false,
//     );
//   }
//   callback(null, true);
// };

// const uploadOptions = {
//   limits: { fileSize: 2 * 1024 * 1024 },
//   fileFilter,
// };

@Controller('contracts')
export class ContractController {
  constructor(
    private readonly contractService: ContractService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private async handleRequest<T>(operation: () => Promise<T>, path: string) {
    try {
      const data = await operation();
      return {
        path,
        status: 'success',
        data,
      };
    } catch (error) {
      const statusCode = error?.getStatus?.() || 500; // Extract status code if available, otherwise default to 500
      return {
        path,
        status: 'failure',
        statusCode,
        data: null,
        error: error.message,
      };
    }
  }

  @UseGuards(JWTAuthGuard)
  @Post('personal-info')
  createOrUpdatePersonalInfo(@Body() dto: PersonalInfoDto) {
    return this.handleRequest(
      () => this.contractService.createOrUpdatePersonalInfo(dto),
      'contracts/personal-info',
    );
  }

  @UseGuards(JWTAuthGuard)
  @Patch('job-details')
  updateJobDetails(@Req() req, @Body() dto: JobDetailsDto) {
    return this.handleRequest(
      () => this.contractService.updateJobDetails(req.user.email, dto),
      'contracts/job-details',
    );
  }

  @UseGuards(JWTAuthGuard)
  @Patch('compensation')
  updateCompensation(@Req() req, @Body() dto: CompensationDto) {
    return this.handleRequest(
      () => this.contractService.updateCompensation(req.user.email, dto),
      'contracts/compensation',
    );
  }

  @Post('text-mail')
  async sendWelcomeEmail(@Body('to') to: string) {
    return this.contractService.emailNotify(to);
  }

  @UseGuards(JWTAuthGuard)
  @Post('signature')
  @UseInterceptors(FileInterceptor('signature')) // handles multiple file uploads
  @ApiConsumes('multipart/form-data')
  async uploadSignature(
    @UploadedFile() signature: Express.Multer.File,
    @Req() req,
  ) {
    try {
      if (!signature) {
        throw new BadRequestException('File is required');
      }

      const uploadedUrl = await this.cloudinaryService.uploadFile(signature);

      return this.handleRequest(
        () => this.contractService.submitSignature(req.user.email, uploadedUrl),
        'contracts/signature',
      );
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw new BadRequestException({
        error: true,
        message: 'Something went wrong during signature upload',
        data: null,
      });
    }
  }

  @UseGuards(JWTAuthGuard)
  @Patch('finalize')
  finalizeContract(@Req() req) {
    return this.handleRequest(
      () => this.contractService.finalizeContract(req.user.email),
      'contracts/finalize',
    );
  }

  @UseGuards(JWTAuthGuard)
  @Get('')
  getContract(@Req() req) {
    return this.handleRequest(
      () => this.contractService.getContract(req.user.email),
      'contracts',
    );
  }

  @UseGuards(AdminAuthGuard)
  @Get('get-all-contract')
  getAllContracts() {
    return this.handleRequest(
      () => this.contractService.getAllContracts(),
      'contracts/get-all-contract',
    );
  }
}
