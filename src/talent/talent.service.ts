import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Talent } from './schemas/talent.schema';
import { Model } from 'mongoose';
import {
  CreateTalentDetailsDto,
  CreateTalentDto,
  UpdateDto,
} from './dto/talent.dto';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { TalentDetailsRepository } from './repository/talent-details.repository';
import { randomBytes } from 'crypto';

@Injectable()
export class TalentService {
  constructor(
    @InjectModel(Talent.name)
    private talentModel: Model<Talent>,
    private userService: UserService,
    private readonly talentDetailsRepository: TalentDetailsRepository,
  ) {}
  private generateTalentId(): string {
    return randomBytes(12).toString('hex'); // 24-char hex
  }

  async become(user: User, payload: CreateTalentDto): Promise<any> {
    const { email, _id, firstName, lastName } = user;
    const talent = await this.talentModel.findOne({ workEmail: email });

    if (talent) {
      if (talent.workEmail === email) {
        throw new BadRequestException(
          'work email has already be used by another talent',
        );
      }
    }

    await this.talentModel.create({
      ...payload,
      workEmail: email,
      firstName: firstName,
      lastName: lastName,
      userId: _id,
    });

    return {
      Response: `your application have been received; kindly wait for approval`,
    };
  }

  //move
  //the sort will be changed to most rated talent;
  //another one is to look at the ui and remove the name and email inputs on the talent form because it is not necessary
  async getAll(): Promise<Talent[]> {
    const talent = await this.talentModel
      .find({ approved: true, isTalentSuspended: false })
      .sort({ createdAt: 'desc' });
    return talent;
  }

  async getById(id: string): Promise<any> {
    const talent = await this.talentModel.findById(id);
    if (!talent) {
      throw new NotFoundException('talent not found');
    }
    return talent;
  }

  async update(user: User, body: UpdateDto) {
    const userId = user._id;
    const [userExist, updateTalent] = await Promise.all([
      this.userService.findUserById(String(userId)),
      this.talentModel.findOneAndUpdate({ userId }, { body }, { new: true }),
    ]);

    if (!userExist) {
      throw userExist;
    }

    if (!updateTalent) {
      throw new ServiceUnavailableException();
    }
  }

  async approvedTalent(id: string) {
    await this.getById(id);
    const approved = await this.talentModel.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true },
    );
    if (approved) {
      const userId = approved.userId;
      await this.userService.approveUserAsTalent(userId.toString());
    }
    return approved;
  }

  async suspendTalent(userId: string) {
    return await this.talentModel.findOneAndUpdate(
      { $or: [{ _id: userId }, { userId: userId }] },
      { isTalentSuspended: true },
      { new: true },
    );
  }

  async unSuspendTalent(userId: string) {
    return await this.talentModel.findOneAndUpdate(
      { $or: [{ _id: userId }, { userId: userId }] },
      { isTalentSuspended: false },
      { new: true },
    );
  }

  async createTalentDetails(data: CreateTalentDetailsDto) {
    try {
      const existingTalent = await this.talentDetailsRepository.findByEmail(
        data.email,
      );
      if (existingTalent) {
        return {
          error: true,
          message: 'Talent with this email already exists',
          data: null,
        };
      }

      const result = await this.talentDetailsRepository.create({
        ...data,
        talentId: this.generateTalentId(),
        dateOfBirth: new Date(data.dateOfBirth),
      });

      return {
        error: false,
        message: 'Talent details successfully created',
        data: result,
      };
    } catch (error) {
      console.error('Error creating talent:', error);
      return {
        error: true,
        message: `Error creating talent: ${error.message}`,
        data: null,
      };
    }
  }

  async findAllTalentDetails() {
    try {
      const result = await this.talentDetailsRepository.findAll();
      return {
        error: false,
        message: 'All talents retrieved successfully',
        data: result,
      };
    } catch (error) {
      console.error('Error retrieving talents:', error);
      return {
        error: true,
        message: `Error retrieving talents: ${error.message}`,
        data: null,
      };
    }
  }

  async findTalentDetailsById(id: string) {
    try {
      const result = await this.talentDetailsRepository.findById(id);
      return {
        error: false,
        message: 'Talent retrieved successfully',
        data: result,
      };
    } catch (error) {
      console.error('Error retrieving talent:', error);
      return {
        error: true,
        message: `Error retrieving talent: ${error.message}`,
        data: null,
      };
    }
  }

  async updateTalentDetails(id: string, data: CreateTalentDetailsDto) {
    try {
      const result = await this.talentDetailsRepository.updateById(id, data);
      return {
        error: false,
        message: 'Talent updated successfully',
        data: result,
      };
    } catch (error) {
      console.error('Error updating talent:', error);
      return {
        error: true,
        message: `Error updating talent: ${error.message}`,
        data: null,
      };
    }
  }

  async deleteTalentDetails(id: string) {
    try {
      const result = await this.talentDetailsRepository.deleteById(id);
      return {
        error: false,
        message: 'Talent deleted successfully',
        data: result,
      };
    } catch (error) {
      console.error('Error deleting talent:', error);
      return {
        error: true,
        message: `Error deleting talent: ${error.message}`,
        data: null,
      };
    }
  }
}
