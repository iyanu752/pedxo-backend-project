import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { assignTalaentDto } from './dto/assignTalent.dto';
import { CreateAdminDto, LoginAdminDto } from './dto/admin.dto';
import { AuthService } from 'src/auth/auth.service';
import { AdminAuthGuard } from 'src/auth/customGuard/admin-auth.guard';
import { TokenService } from 'src/talent/token.service';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Post('signup')
  signup(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  @Post('login')
  login(@Body() dto: LoginAdminDto) {
    return this.authService.loginAdmin(dto);
  }

  // Admin generates token
  @Post('generate-token')
  @UseGuards(AdminAuthGuard)
  async generateToken() {
    const token = await this.tokenService.generateToken();
    return { token, expiresIn: '20 minutes' };
  }

  @UseGuards(AdminAuthGuard)
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
  @UseGuards(AdminAuthGuard)
  async asignTallet(@Body() payload: assignTalaentDto) {
    return this.adminService.asignTallet(payload.talentIds, payload.hierId);
  }
}
