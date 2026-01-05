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
  Query,
  Res,
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
import { Request, Response } from 'express';
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

const CONTRACT_DETAILS = 'CONTRACT_DETAILS';

@Controller('contracts')
export class ContractController {
  constructor(
    private readonly contractService: ContractService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

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

  // private getContractIdFromCookies(
  //   req: Request
  // ): string {
  //   const contractCookie = req.cookies?.[CONTRACT_DETAILS];

  //   if (!contractCookie || !contractCookie._id) {
  //     throw new BadRequestException('Contract details not found in cookies');
  //   }

  //   return contractCookie._id;
  // }

  @UseGuards(JWTAuthGuard)
  @Post('personal-info')
  createOrUpdatePersonalInfo(@Req() req, @Res({ passthrough: true }) res: Response, @Body() dto: PersonalInfoDto) {
    return this.handleRequest(
      () => this.contractService.createOrUpdatePersonalInfo(req.user._id, dto),
      'contracts/personal-info',
    );
  }

  @UseGuards(JWTAuthGuard)
  @Patch('job-details')
  updateJobDetails(
    // @Req() req: Request,
    @Body() dto: JobDetailsDto,
    @Query('contractId') contractId: string
  ) {
    return this.handleRequest(
      () => this.contractService.updateJobDetails(contractId, dto),
      'contracts/job-details',
    );
  }

  @UseGuards(JWTAuthGuard)
  @Patch('compensation')
  updateCompensation(
    // @Req() req: Request,
    @Body() dto: CompensationDto,
    @Query('contractId') contractId: string
  ) {
    return this.handleRequest(
      () => this.contractService.updateCompensation(contractId, dto),
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
    // @Req() req: Request,
    @Query('contractId') contractId: string
  ) {
    try {
      if (!signature) {
        throw new BadRequestException('File is required');
      }

      const uploadResult = await this.cloudinaryService.uploadFile(signature);
      const uploadedUrl =
        (uploadResult as any)?.secure_url || (uploadResult as any)?.url || '';

      return this.handleRequest(
        () => this.contractService.submitSignature(contractId, uploadedUrl),
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
  finalizeContract(
    // @Req() req: Request,
    @Query('contractId') contractId: string
  ) {
    return this.handleRequest(
      () => this.contractService.finalizeContract(contractId),
      'contracts/finalize',
    );
  }

  @UseGuards(JWTAuthGuard)
  @Get('get-contract')
  getContractById(
    @Query('contractId') contractId: string
  ) {
    return this.handleRequest(
      () => this.contractService.getContractById(contractId),
      'contracts/get-contract',
    )
  }

  @UseGuards(JWTAuthGuard)
  @Get('get-user-contracts')
  getContract(@Req() req) {
    return this.handleRequest(
      () => this.contractService.getContract(req.user.email),
      'contracts/get-user-contracts',
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
