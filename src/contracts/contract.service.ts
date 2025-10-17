import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contract, ContractDocument } from './schemas/contract.schema';
import { PersonalInfoDto } from './dto/personal-info.dto';
import { JobDetailsDto } from './dto/job-details.dto';
import { CompensationDto } from './dto/compensation.dto';
import { ContractEmailDto } from './dto/contract.email.dto';
import { EmailService } from '../common/email.service';

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    private emailservice: EmailService,
  ) {}

  private async handleDatabaseOperation<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    try {
      const result = await operation();
      if (!result) throw new NotFoundException('Contract not found');
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Database operation failed');
    }
  }

  async emailNotify(to: string) {
    try {
      const subject = 'Test Email Sending';
      const text = 'We miss you bruuuhhh';

      await this.emailservice.sendPlainTextEmail(to, subject, text);

      console.log(`email sent succcess ${to}`);
    } catch (error) {
      console.log(`Failed to sent mail`, error);
    }
  }

  async createOrUpdatePersonalInfo(userId: string, dto: PersonalInfoDto) {
    return this.handleDatabaseOperation(async () => {
      const newDto = { userId, ...dto };
      let contract = await this.contractModel.findOne({ email: dto.email });

      if (!contract) {
        contract = new this.contractModel({
          ...newDto,
          progress: 'job-details',
        });
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

  async submitSignature(email: string, signatureUrl: string) {
    return this.handleDatabaseOperation(async () => {
      return this.contractModel.findOneAndUpdate(
        { email },
        { $set: { signature: signatureUrl, progress: 'signed' } },
        { new: true },
      );
    });
  }

  async finalizeContract(email: string) {
    try {
      // console.log('email', email);
      const contract = await this.contractModel.findOneAndUpdate(
        { email },
        { $set: { isCompleted: true } },
        { new: true },
      );
      // console.log('fetched contrract', contract);
      const contractDto = new ContractEmailDto(contract);
      // console.log(' contrract dto', contractDto);
      await this.emailservice.sendContractEmail(contractDto);

      return {
        error: false,
        message: 'Successfully Finalized Contract',
        data: contract,
      };
    } catch (error) {
      console.error('Error finalizing contract:', error);
      return {
        error: true,
        message: `Error finalizing contract ${error.message}`,
        data: null,
      };
    }
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

  async getContract(userId: string) {
    return this.handleDatabaseOperation(() =>
      this.contractModel.find({ userId }),
    );
  }

  async getContractById(id: string) {
    return this.handleDatabaseOperation(() => this.contractModel.findById(id));
  }

  async getAllContracts() {
    return this.handleDatabaseOperation(async () => {
      const contracts = await this.contractModel.find().exec();
      if (!contracts || contracts.length === 0) {
        throw new NotFoundException('No contracts found');
      }
      return contracts;
    });
  }
}
