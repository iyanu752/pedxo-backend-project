import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { assignTalaentDto } from './dto/assignTalent.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  //@UseGuards(AuthGuard)//i will use this to make only admin to only approve talent
  @Post('approve-talent/:id')
  async Approved(@Param('id') id: string) {
    return await this.adminService.approvedTalent(id);
  }

  @Post('suspend-user/:id')
  async suspendUser(@Param('id') id: string) {
    return await this.adminService.suspendUser(id);
  }

  @Post('suspend-talent/:id')
  async suspendTalent(@Param('id') id: string) {
    return await this.adminService.suspendTalent(id);
  }

  @Post('unsuspend-user/:id')
  async UnsuspendUser(@Param('id') id: string) {
    return await this.adminService.unSuspendUser(id);
  }

  @Post('unsuspend-talent/:id')
  async UnsuspendTalent(@Param('id') id: string) {
    return await this.adminService.unSuspendTalent(id);
  }

  @Patch('asign-tallet')
  async asignTallet(@Body() payload: assignTalaentDto) {
    return this.adminService.asignTallet(payload.talentIds, payload.hierId);
  }
}
