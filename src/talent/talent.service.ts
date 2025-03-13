import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Talent } from './schemas/talent.schema';
import { Model } from 'mongoose';
import { CreateTalentDto, UpdateDto } from './dto/talent.dto';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TalentService {
  constructor(
    @InjectModel(Talent.name)
    private talentModel: Model<Talent>,
    private userService: UserService,
  ) {}
  //move
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
      this.userService.findUserById(userId),
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
}
