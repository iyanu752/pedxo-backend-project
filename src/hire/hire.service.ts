import {
  // BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { HireDTO } from './dto/hire.talent.dto';
import { User } from 'src/user/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Hire } from './schemas/hire.schema';
import { Model } from 'mongoose';
import { TalentDetailsRepository } from 'src/talent/repository/talent-details.repository';
import { ContractService } from 'src/contracts/contract.service';
import { Contract } from 'src/contracts/schemas/contract.schema';

@Injectable()
export class HireService {
  constructor(
    @InjectModel(Hire.name) private hireModel: Model<Hire>,
    @InjectModel(Contract.name) private contractModel: Model<Contract>,
    private readonly talentRepo: TalentDetailsRepository,
    private readonly contractService: ContractService,
  ) {}

  private async _formatAssignedTalents(contractId: string) {
    const contract = await this.contractService.getContractById(contractId);

    const assignedTalents = await Promise.all(
      (contract.talentAssignedId || []).map(async (talentId) => {
        const talent = await this.talentRepo.findByTalentId(talentId);
        if (!talent) return null;

        return {
          fullName: `${talent.firstName} ${talent.lastName}`,
          email: talent.email,
          country: talent.country,
          githubAccount: talent.githubAccount,
          paymentRate: contract?.paymentRate,
          paymentFrequency: contract?.paymentFrequency,
          seniorityLevel: contract?.seniorityLevel,
          roleTitle: contract?.roleTitle,
        };
      }),
    );

    return {
      error: false,
      message: 'Assigned talents fetched successfully',
      data: assignedTalents.filter(Boolean),
    };
  }

  async talent(payload: HireDTO, user: User) {
    const { _id } = user;

    const contract = await this.contractService.getContractById(
      payload.contractId,
    );

    if (!contract) {
      return {
        error: true,
        message: 'Invalid Contract ID',
        data: null,
      };
    }
    if (!user || user.isSuspended === true) {
      throw new ForbiddenException('you can proceed with request');
    }

    const hiredTalent = await this.hireModel.create({
      ...payload,
      userId: _id,
    });

    return hiredTalent;
  }

  async assignTalent(talentAssignedId: string[], contractId: string) {
    try {
      // const hire = await this.hireModel.findById(hireId);
      // if (!hire) {
      //   return {
      //     error: true,
      //     message: 'Hire with this ID does not exist',
      //     data: null,
      //   };
      // }

      const contract = await this.contractModel.findById(contractId);
      if (!contract) {
        return {
          error: true,
          message: 'Contract with this ID does not exist',
          data: null,
        };
      }
      for (const id of talentAssignedId) {
      
        const talentExists = await this.talentRepo.findByTalentId(id);
       
        if (!talentExists) {
          return {
            error: true,
            message: `Talent with ID ${id} does not exist`,
            data: null,
          };
        }
      }

      const updatedContract = await this.contractModel.findByIdAndUpdate(
        contractId,
        { $addToSet: { talentAssignedId: { $each: talentAssignedId } } },
        { new: true }, // Return updated document
      );

      return {
        error: false,
        message: 'Talents assigned successfully',
        data: updatedContract,
      };
    } catch (e) {
      return {
        error: true,
        message: e.message,
        data: null,
      };
    }
  }

  async getAssignedTalentsByUser(userId: string) {
    try {
      const contracts = await this.contractModel.find({ userId });

      // console.log('hires', hires);
      if (!contracts) {
        return {
          error: true,
          message: 'Hire with this ID does not exist',
          data: null,
        };
      }

      const result = [];

      for (const contract of contracts) {
        // const contract = await this.contractService.getContractById(
        //   hire.contractId,
        // );

        const enrichedTalents = await Promise.all(
          (contract.talentAssignedId || []).map(async (talentId) => {
            const talent = await this.talentRepo.findByTalentId(talentId);
            if (!talent) return null;

            return {
              fullName: `${talent.firstName} ${talent.lastName}`,
              email: talent.email,
              country: talent.country,
              githubAccount: talent.githubAccount,
              paymentRate: contract?.paymentRate,
              paymentFrequency: contract?.paymentFrequency,
              seniorityLevel: contract?.seniorityLevel,
              roleTitle: contract?.roleTitle,
            };
          }),
        );

        result.push({
          contractId: contract._id,
          assignedTalents: enrichedTalents.filter(Boolean),
        });
      }

      return {
        error: false,
        message: 'Assigned talents fetched successfully',
        data: result,
      };
    } catch (error) {
      return {
        error: true,
        message: `Error getting assigned talents by user: ${error.message}`,
        data: null,
      };
    }
  }

  // async getAssignedTalentByHireId(hireId: string) {
  //   try {
  //     const hire = await this.hireModel.findById(hireId);
  //     if (!hire) {
  //       return {
  //         error: true,
  //         message: 'No hire found with this ID',
  //         data: null,
  //       };
  //     }

  //     return this._formatAssignedTalents(hire);
  //   } catch (error) {
  //     return {
  //       error: true,
  //       message: `Error getting assigned talents by hireId: ${error.message}`,
  //       data: null,
  //     };
  //   }
  // }

  async getAssignedTalentByContractId(contractId: string) {
    try {
      const contract = await this.contractModel.findById(contractId);
      if (!contract) {
        return {
          error: true,
          message: 'No Contract found with this contract ID',
          data: null,
        };
      }

      return this._formatAssignedTalents(contractId);
    } catch (error) {
      return {
        error: true,
        message: `Error getting assigned talents by contractId: ${error.message}`,
        data: null,
      };
    }
  }

  async getAllHires() {
    try {
      const hires = await this.hireModel.find().exec();
      return {
        error: false,
        message: 'All hires fetched successfully',
        data: hires,
      };
    } catch (error) {
      return {
        error: true,
        message: `Error getting all hires: ${error.message}`,
        data: null,
      };
    }
  }
}
