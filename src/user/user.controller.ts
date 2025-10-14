import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Delete,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { AuthGuard } from 'src/auth/customGuard/guard.custom';
import { CurrentUser } from 'src/common/decorator/current.logged.user';
import { UpdateUserDTO } from './dto/update.user.dto';
import { Serialize } from 'src/common/interceptor/custom.interceptor';
import { AllUserDto, UserDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
// import { AuthGuard as Guard } from '@nestjs/passport';

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
    const currentUser = await this.userService.findUserById(String(user._id));
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

  @UseGuards(AuthGuard)
  @Patch('me/profile-pic')
  @UseInterceptors(FileInterceptor('profilePic'))
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ): Promise<{ message: string; updatedUser?: User }> {
    return this.userService.updateProfilePic(user.email, file);
  }

  @Delete('me/profile-pic')
  @UseGuards(AuthGuard)
  async deleteProfilePic(@CurrentUser() user: User) {
    return await this.userService.deleteProfilePic(user.email);
  }
}
