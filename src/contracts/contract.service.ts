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
      // const newDto = { userId, ...dto };
      // let contract = await this.contractModel.findOne({ email: dto.email });

      // if (!contract) {
      const contract = new this.contractModel({
        userId,
        ...dto,
        progress: 'job-details',
      });
      // console.log('contract', contract);
      return contract.save();
      // }

      // Object.assign(contract, { ...dto, progress: 'job-details' });
      // return contract.save();
    });
  }

  async updateJobDetails(contractId: string, dto: JobDetailsDto) {
    return this.updateContract(contractId, dto, 'compensation');
  }

  async updateCompensation(contractId: string, dto: CompensationDto) {
    return this.updateContract(contractId, dto, 'review');
  }

  async submitSignature(contractId: string, signatureUrl: string) {
    return this.handleDatabaseOperation(async () => {
      return this.contractModel.findOneAndUpdate(
        { _id: contractId },
        { $set: { signature: signatureUrl, progress: 'signed' } },
        { new: true },
      );
    });
  }

  async finalizeContract(contractId: string) {
    try {
      // console.log('email', email);
      const contract = await this.contractModel.findOneAndUpdate(
        { _id: contractId },
        { $set: { isCompleted: true } },
        { new: true },
      );
      // console.log('fetched contrract', contract);
      const contractDto = new ContractEmailDto(contract);
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

  private async updateContract(
    contractId: string,
    dto: any,
    nextProgress: string,
  ) {
    return await this.handleDatabaseOperation(async () => {
      const contract = await this.contractModel.find({ _id: contractId });
      // console.log(contract);
      return this.contractModel.findOneAndUpdate(
        { _id: contractId },
        { $set: { ...dto, progress: nextProgress } },
        { new: true },
      );
    });
  }
  async getContract(userId: string) {
    return this.handleDatabaseOperation(async () => {
      const contracts = await this.contractModel.find({ userId });
  
      return {
        total: contracts.length,
        contracts,
      };
    });
  }
  

  async getContractById(id: string) {
    return this.handleDatabaseOperation(() => this.contractModel.findById(id));
  }

  async getTotalAssignedTalents(email: string) {
    try {
      const contracts = await this.contractModel.find({ email });

      const totalAssignedTalents = contracts.reduce(
        (sum, contract) => sum + (contract.talentAssignedId?.length || 0),
        0,
      );

      return {
        error: false,
        message: 'Total assigned talents fetched successfully',
        data: {
          totalAssignedTalents,
        },
      };
    } catch (e) {
      return {
        error: true,
        message: e.message,
        data: null,
      };
    }
  }

  async getPendingContractsCount(email: string) {
    try {
      const pendingContractsCount = await this.contractModel.countDocuments({
        email,
        $or: [
          { talentAssignedId: { $exists: false } },
          { talentAssignedId: { $size: 0 } },
        ],
      });

      return {
        error: false,
        message: 'Pending contracts count fetched successfully',
        data: {
          pendingContractsCount,
        },
      };
    } catch (e) {
      return {
        error: true,
        message: e.message,
        data: null,
      };
    }
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
