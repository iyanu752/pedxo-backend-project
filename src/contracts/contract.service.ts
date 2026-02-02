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
import {
  DeleteContractDto,
  UpdateContractDto,
} from './dto/update-contract.dto';

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
      if (!contract) {
        return {
          error: true,
          message: 'Invalid Contract ID',
          data: null,
        };
      }
      return this.contractModel.findOneAndUpdate(
        { _id: contractId },
        { $set: { ...dto, progress: nextProgress } },
        { new: true },
      );
    });
  }
  async getContract(userId: string) {
    return this.handleDatabaseOperation(async () => {
      const contracts = await this.contractModel
        .find({ userId })
        .sort({ updatedAt: -1 });
      return {
        total: contracts.length,
        contracts,
      };
    });
  }

  async getContractById(id: string) {
    return this.handleDatabaseOperation(() => this.contractModel.findById(id));
  }

  async getTotalAssignedTalents(userId: string) {
    try {
      const contracts = await this.contractModel.find({ userId });

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

  async getPendingContractsCount(userId: string) {
    try {
      const pendingContractsCount = await this.contractModel.countDocuments({
        userId,
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

  async updateSingleContract(contractId: string, dto: UpdateContractDto) {
    return this.handleDatabaseOperation(async () => {
      const contract = await this.contractModel.findById(contractId);

      if (!contract) {
        return {
          error: true,
          message: 'Invalid Contract ID',
          data: null,
        };
      }

      const changes: {
        field: string;
        oldValue: any;
        newValue: any;
      }[] = [];

      const editableFields = [
        'contractType',
        'startDate',
        'endDate',
        'roleTitle',
        'seniorityLevel',
        'scopeOfWork',
        'paymentRate',
        'paymentFrequency',
      ];

      for (const field of editableFields) {
        if (dto[field] !== undefined) {
          const oldVal = contract[field];
          const newVal = dto[field];

          if (String(oldVal) !== String(newVal)) {
            changes.push({
              field,
              oldValue: oldVal,
              newValue: newVal,
            });
          }
        }
      }

      const updatedContract = await this.contractModel.findByIdAndUpdate(
        contractId,
        {
          $set: {
            contractType: dto.contractType,
            startDate: dto.startDate,
            endDate: dto.endDate,
            roleTitle: dto.roleTitle,
            seniorityLevel: dto.seniorityLevel,
            scopeOfWork: dto.scopeOfWork,
            paymentRate: dto.paymentRate,
            paymentFrequency: dto.paymentFrequency,
          },
        },
        { new: true },
      );

      if (changes.length > 0) {
        await this.emailservice.sendContractUpdatedAlert({
          to: 'victor@pedxo.com',
          contractId: contract._id.toString(),
          companyName: contract.companyName,
          changes,
        });
      }

      return {
        error: false,
        message: 'Contract updated successfully',
        data: updatedContract,
      };
    });
  }

  async deleteContract(body: DeleteContractDto) {
    return this.handleDatabaseOperation(async () => {
      const { contractId, ...review } = body;

      const contract = await this.contractModel.findById(contractId);

      if (!contract) {
        return {
          error: true,
          message: 'Invalid Contract ID',
          data: null,
        };
      }

      // Delete contract
      await this.contractModel.findByIdAndDelete(contractId);

      // Send deletion alert email
      await this.emailservice.sendContractDeletedEmail({
        to: 'victor@pedxo.com',
        contract: {
          ...contract.toObject(),
          _id: contract._id.toString(),
        },
        performanceRating: review.performanceRating,
        terminationReason: review.terminationReason,
      });

      return {
        error: false,
        message: 'Contract deleted successfully',
        data: {
          contractId,
        },
      };
    });
  }
}
