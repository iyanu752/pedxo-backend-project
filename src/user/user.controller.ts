import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { AuthGuard } from 'src/auth/customGuard/guard.custom';
import { CurrentUser } from 'src/common/decorator/current.logged.user';
import { UpdateUserDTO } from './dto/update.user.dto';
import { Serialize } from 'src/common/interceptor/custom.interceptor';
import { AllUserDto, UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Serialize(AllUserDto)
  @Get()
  async getAll(): Promise<User[]> {
    return await this.userService.fetchAllUsers();
  }

  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  @Get('/profile')
  async dashboard(@CurrentUser() user: User) {
    const currentUser = await this.userService.findUserById(user._id);
    return currentUser;
  }

  @Get('findOne/:id')
  async getById(@Param('id') id: string): Promise<User> {
    return await this.userService.findUserById(id);
  }

  @UseGuards(AuthGuard)
  @Patch('update')
  async update(@Body() payload: UpdateUserDTO, @CurrentUser() user: User) {
    return await this.userService.updateUserProfile(payload, user);
  }

  @Get('delete/:username')
  async deleteUser(@Param('username') username: string) {
    return await this.userService.deleteUserByUsername(username);
  }
}
