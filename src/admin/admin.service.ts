import {
  Injectable,
  // NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HireService } from 'src/hire/hire.service';
import { TalentService } from 'src/talent/talent.service';
// import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { CreateAdminDto } from './dto/admin.dto';
import { HashData } from 'src/common/hashed/hashed.data';

@Injectable()
export class AdminService {
  constructor(
    private userService: UserService,
    private talentService: TalentService,
    private hierServic: HireService,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async approvedTalent(id: string): Promise<any> {
    const talent = await this.talentService.getById(id);
    if (talent.approved === true) {
      throw new UnprocessableEntityException('talent is already approved');
    }

    return await this.talentService.approvedTalent(talent);
  }

  async suspendUser(id: string) {
    await this.userService.findUserById(id);
    const userSuspended = await this.userService.suspendUserAccount(id);
    if (userSuspended.isTalent === true) {
      const userId = userSuspended._id;
      await this.suspendTalent(userId);
    }
  }

  async suspendTalent(id: string) {
    const talent = await this.talentService.getById(id);
    if (!talent) {
      console.error('Not Found');
    }
    return await this.talentService.suspendTalent(id);
  }

  async unSuspendUser(id: string) {
    await this.userService.findUserById(id);
    const unSuspendedUser = await this.userService.unsuspendUserAccount(id);
    if (unSuspendedUser.isTalent === true) {
      const userId = unSuspendedUser._id;
      await this.unSuspendTalent(userId);
    }
  }

  async unSuspendTalent(id: string) {
    const talent = await this.talentService.getById(id);
    if (!talent) {
      console.error('Not Found');
    }
    return await this.talentService.unSuspendTalent(id);
  }

  async asignTallet(talentIds: string[], hierId: string) {
    return await this.hierServic.assignTalent(talentIds, hierId);
  }

  async create(dto: CreateAdminDto) {
    if (dto.signupKey !== process.env.ADMIN_SIGNUP_KEY) {
      return { error: true, message: 'Invalid signup key', data: null };
    }

    const existing = await this.findByEmail(dto.email);
    if (existing) {
      return {
        error: true,
        message: 'Admin with this email already exists',
        data: null,
      };
    }

    dto.password = await HashData(dto.password);
    const admin = await this.adminModel.create(dto);
    return { error: false, message: 'Admin created successfully', data: admin };
  }

  async findByEmail(email: string) {
    return this.adminModel.findOne({ email }).exec();
  }
}
