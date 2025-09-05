import { Body, Controller, Get, Query, Post, UseGuards } from '@nestjs/common';
import { HireService } from './hire.service';
import { CurrentUser } from 'src/common/decorator/current.logged.user';
import { AuthGuard } from 'src/auth/customGuard/guard.custom';
import { HireDTO } from './dto/hire.talent.dto';
import { User } from 'src/user/schema/user.schema';

@Controller('hire')
export class HireController {
  constructor(private hireService: HireService) {}

  @Post('hire-talent')
  @UseGuards(AuthGuard)
  async talent(@Body() hireInput: HireDTO, @CurrentUser() user: User) {
    return await this.hireService.talent(hireInput, user);
  }

  @Get('assigned-by-user')
  @UseGuards(AuthGuard)
  getByUser(@CurrentUser() user: User) {
    // console.log(user._id);
    return this.hireService.getAssignedTalentsByUser(user._id);
  }

  @Get('assigned-by-hire')
  getAssignedTalentByHire(@Query('hireId') hireId: string) {
    return this.hireService.getAssignedTalentByHireId(hireId);
  }

  @Get('assigned-by-contract')
  getAssignedTalentByContract(@Query('contractId') contractId: string) {
    return this.hireService.getAssignedTalentByContractId(contractId);
  }

  @Get('get-all-hires')
  getAllHires() {
    return this.hireService.getAllHires();
  }
}
