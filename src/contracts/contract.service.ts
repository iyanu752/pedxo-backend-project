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
import { TalentDetailsRepository } from 'src/talent/repository/talent-details.repository';
import {
  ContractTermination,
  ContractTerminationDocument,
} from './schemas/contract-termination.schema';

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    @InjectModel(ContractTermination.name)
    private terminationModel: Model<ContractTerminationDocument>,
    private emailservice: EmailService,
    private talentRepo: TalentDetailsRepository,
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

      const updateOps: any = { $set: {} };

      // ---------- Field updates ----------
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

            updateOps.$set[field] = newVal;
          }
        }
      }

      // ---------- Talent removal ----------
      let removedTalents: string[] = [];

      if (dto.removeTalentIds?.length && contract.talentAssignedId?.length) {
        removedTalents = contract.talentAssignedId.filter((id) =>
          dto.removeTalentIds.includes(id),
        );

        if (removedTalents.length) {
          const newTalentList = contract.talentAssignedId.filter(
            (id) => !dto.removeTalentIds.includes(id),
          );

          changes.push({
            field: 'talentAssignedId',
            oldValue: contract.talentAssignedId,
            newValue: newTalentList,
          });

          updateOps.$pull = {
            talentAssignedId: { $in: removedTalents },
          };
        }
      }

      // ---------- Validation before DB write ----------
      if (removedTalents.length) {
        if (!dto.performanceRating || !dto.terminationReason) {
          return {
            error: true,
            message:
              'performanceRating and terminationReason are required when removing talents',
            data: null,
          };
        }
      }

      // ---------- Persist contract update ----------
      const updatedContract =
        Object.keys(updateOps.$set).length || updateOps.$pull
          ? await this.contractModel.findByIdAndUpdate(contractId, updateOps, {
              new: true,
            })
          : contract;

      const terminationSummary: {
        talentName: string;
        performanceRating: number;
        terminationReason: string;
      }[] = [];

      // ---------- Save termination records + fetch talents ----------
      if (removedTalents.length) {
        const talents = await Promise.all(
          removedTalents.map((id) => this.talentRepo.findByTalentId(id)),
        );

        await Promise.all(
          talents.filter(Boolean).map(async (talent) => {
            const fullName = `${talent.firstName} ${talent.lastName}`;

            terminationSummary.push({
              talentName: fullName,
              performanceRating: dto.performanceRating,
              terminationReason: dto.terminationReason,
            });

            await this.terminationModel.create({
              contractId: contract._id,
              userId: contract.userId,
              talentId: talent.talentId,
              talentName: fullName,
              companyName: contract.companyName,
              terminationReason: dto.terminationReason,
              performanceRating: dto.performanceRating,
              terminatedByEmail: contract.email,
            });

            // Send talent email
            await this.emailservice.sendTalentContractTerminationEmail({
              to: talent.email,
              fullName,
              companyName: contract.companyName,
              roleTitle: contract.roleTitle,
              contractId: contract._id.toString(),
            });
          }),
        );
      }

      // ---------- Notify admin + client ----------
      if (changes.length || terminationSummary.length) {
        const recipients = new Set<string>(['victor@pedxo.com']);

        if (contract.email) {
          recipients.add(contract.email.toLowerCase());
        }

        await Promise.all(
          [...recipients].map((email) =>
            this.emailservice.sendContractUpdatedAlert({
              to: email,
              contractId: contract._id.toString(),
              companyName: contract.companyName,
              changes,
              terminationSummary,
            }),
          ),
        );
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
      const { contractId, performanceRating, terminationReason } = body;

      const contract = await this.contractModel.findById(contractId);

      if (!contract) {
        return {
          error: true,
          message: 'Invalid Contract ID',
          data: null,
        };
      }

      // Send termination emails to talents
      if (contract.talentAssignedId?.length) {
        for (const talentId of contract.talentAssignedId) {
          // fetch talent user
          const talent = await this.talentRepo.findByTalentId(talentId);

          if (talent?.email) {
            await this.emailservice.sendTalentContractTerminationEmail({
              to: talent.email,
              fullName: `${talent.firstName} ${talent.lastName}`,
              companyName: contract.companyName,
              roleTitle: contract.roleTitle,
              contractId: contract._id.toString(),
            });
          }
        }
      }

      // Admin alert
      await this.emailservice.sendContractDeletedEmail({
        to: 'victor@pedxo.com',
        contract: {
          ...contract.toObject(),
          _id: contract._id.toString(),
        },
        performanceRating,
        terminationReason,
      });

      // Client confirmation email
      await this.emailservice.sendClientContractDeletedEmail({
        to: contract.email,
        contractId: contract._id.toString(),
        companyName: contract.companyName,
        roleTitle: contract.roleTitle,
        contractType: contract.contractType,
      });

      if (contract.talentAssignedId?.length) {
        for (const talentId of contract.talentAssignedId) {
          await this.terminationModel.create({
            contractId: contract._id,
            userId: contract.userId,
            talentId,
            terminationReason,
            performanceRating,
            terminatedByEmail: contract.email,
          });
        }
      }

      // Delete after all emails
      await this.contractModel.findByIdAndDelete(contractId);

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
