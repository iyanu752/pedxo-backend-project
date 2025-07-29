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

@Injectable()
export class HireService {
  constructor(
    @InjectModel(Hire.name) private hireModel: Model<Hire>,
    private readonly talentRepo: TalentDetailsRepository,
  ) {}
  async talent(payload: HireDTO, user: User) {
    const { _id } = user;
    if (!user || user.isSuspended === true) {
      throw new ForbiddenException('you can proceed with request');
    }

    const hiredTalent = await this.hireModel.create({
      ...payload,
      userId: _id,
    });

    return hiredTalent;
  }

  async assignTalent(talentAssignedId: string[], hireId: string) {
    try {
      const hire = await this.hireModel.findById(hireId);
      if (!hire) {
        return {
          error: true,
          message: 'Hire with this ID does not exist',
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

      hire.talentAssignedId = talentAssignedId;
      await hire.save();

      return {
        error: false,
        message: 'Talents assigned successfully',
        data: hire,
      };
    } catch (e) {
      return {
        error: true,
        message: e.message,
        data: null,
      };
    }
  }
}
