import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contract, ContractDocument } from './schemas/contract.schema';
import { PersonalInfoDto } from './dto/personal-info.dto';
import { JobDetailsDto } from './dto/job-details.dto';
import { CompensationDto } from './dto/compensation.dto';
import { S3Service } from 'src/s3service/s3service.service';
import { ContractEmailDto } from './dto/contract.email.dto';
import { EmailService } from '../common/email.service';

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    private s3service: S3Service,
    private emailservice: EmailService,
  ) {}

  private async handleDatabaseOperation<T>(operation: () => Promise<T>): Promise<T> {
    try {
      const result = await operation();
      if (!result) throw new NotFoundException('Contract not found');
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Database operation failed');
    }
  }

  async createOrUpdatePersonalInfo(dto: PersonalInfoDto) {
    return this.handleDatabaseOperation(async () => {
      let contract = await this.contractModel.findOne({ email: dto.email });

      if (!contract) {
        contract = new this.contractModel({ ...dto, progress: 'job-details' });
        return contract.save();
      }

      Object.assign(contract, { ...dto, progress: 'job-details' });
      return contract.save();
    });
  }

  async updateJobDetails(email: string, dto: JobDetailsDto) {
    return this.updateContract(email, dto, 'compensation');
  }

  async updateCompensation(email: string, dto: CompensationDto) {
    return this.updateContract(email, dto, 'review');
  }

  async submitSignature(email: string, file: Express.Multer.File) {
    return this.handleDatabaseOperation(async () => {
      const signatureUrl = await this.s3service.uploadSignature(file);
      return this.contractModel.findOneAndUpdate(
        { email },
        { $set: { signature: signatureUrl, progress: 'signed' } },
        { new: true },
      );
    });
  }

  async finalizeContract(email: string) {
    return this.handleDatabaseOperation(async () => {
      const contract = await this.contractModel.findOneAndUpdate(
        { email },
        { $set: { isCompleted: true } },
        { new: true },
      );
      const contractDto = new ContractEmailDto(contract);
      await this.emailservice.sendContractEmail(contractDto);
      return contract;
    });
  }

  private async updateContract(email: string, dto: any, nextProgress: string) {
    return this.handleDatabaseOperation(() =>
      this.contractModel.findOneAndUpdate(
        { email },
        { $set: { ...dto, progress: nextProgress } },
        { new: true },
      ),
    );
  }

  async getContract(email: string) {
    return this.handleDatabaseOperation(() => this.contractModel.findOne({ email }));
  }
}
