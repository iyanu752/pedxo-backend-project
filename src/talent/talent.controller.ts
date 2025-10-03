import {
  Body,
  Controller,
  Param,
  UseGuards,
  Get,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { TalentService } from './talent.service';
import { CurrentUser } from 'src/common/decorator/current.logged.user';
import { AuthGuard } from 'src/auth/customGuard/guard.custom';
import { Talent } from './schemas/talent.schema';
import {
  CreateTalentDto,
  UpdateDto,
  CreateTalentDetailsDto,
} from './dto/talent.dto';
import { User } from 'src/user/schema/user.schema';
import { TokenGuard } from 'src/auth/customGuard/token.guard';
import { AdminAuthGuard } from 'src/auth/customGuard/admin-auth.guard';

@Controller('talent')
export class TalentController {
  constructor(private talentService: TalentService) {}

  @Get()
  async getAll(): Promise<Talent[]> {
    return await this.talentService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<any> {
    return await this.talentService.getById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async become(
    @CurrentUser() user: User,
    @Body() payload: CreateTalentDto,
  ): Promise<any> {
    return await this.talentService.become(user, payload);
  }

  @UseGuards(AuthGuard)
  @Patch()
  async update(@Body() payload: UpdateDto, @CurrentUser() user: User) {
    return await this.talentService.update(user, payload);
  }

  // === Talent Details Routes ===

  @Post('details')
  @UseGuards(TokenGuard)
  async createTalentDetails(@Body() data: CreateTalentDetailsDto) {
    return await this.talentService.createTalentDetails(data);
  }

  @Get('get-all-talents')
  @UseGuards(AdminAuthGuard)
  async findAllTalentDetails() {
    return await this.talentService.findAllTalentDetails();
  }

  @Get('details/:id')
  async findTalentDetailsById(@Param('id') id: string) {
    return await this.talentService.findTalentDetailsById(id);
  }

  @Patch('details/:id')
  async updateTalentDetails(
    @Param('id') id: string,
    @Body() data: CreateTalentDetailsDto,
  ) {
    return await this.talentService.updateTalentDetails(id, data);
  }

  @Delete('details/:id')
  async deleteTalentDetails(@Param('id') id: string) {
    return await this.talentService.deleteTalentDetails(id);
  }
}
