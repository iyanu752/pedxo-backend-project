import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/dto/create.user.dto';
import { LoginUserDTO } from './dto/login.user.dto';
import {
  ForgetPasswordDto,
  RequestOtpDto,
  ResetPasswordDto,
  VerifyEmailDto,
  VerifyForgetPasswordDto,
} from './dto/auth.dto';
import { Serialize } from 'src/common/interceptor/custom.interceptor';
import { LoginResponse, UserDto } from 'src/user/dto/user.dto';
import { AuthGuard } from './customGuard/guard.custom';
import { CurrentUser } from 'src/common/decorator/current.logged.user';
import { User } from 'src/user/schema/user.schema';
import { AuthGuard as Guard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async create(@Body() body: CreateUserDTO) {
    return await this.authService.create(body);
  }

  // @Serialize(UserDto)
  @Serialize(LoginResponse)
  @Post('login')
  async login(@Body() body: LoginUserDTO) {
    return await this.authService.login(body);
  }

  @Post('verify-email')
  async verifyEmail(@Body() payload: VerifyEmailDto) {
    // console.log('contr pay', payload);
    return await this.authService.verifyEmail(payload);
    // console.log('access', accessToken);
    // res.cookie('access_token', accessToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'lax',
    //   maxAge: 1000 * 60 * 60 * 1, // 1 day
    // });

    // // Send a clean JSON response
    // return res.status(200).json({
    //   success: true,
    //   message:
    //     'Email verified successfully. You are now being redirected to your dashboard.',
    // });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() payload: ForgetPasswordDto) {
    return await this.authService.forgotPassword(payload);
  }

  @Post('verify-reset-password-otp')
  async verifyPasswordOtp(@Body() payload: VerifyForgetPasswordDto) {
    return await this.authService.verifyPasswordOtp(payload);
  }

  @Post('reset-password')
  async resetPassword(@Body() payload: ResetPasswordDto) {
    return await this.authService.resetPassword(payload);
  }

  @Post('request-otp')
  async requestOtp(@Body() payload: RequestOtpDto) {
    return await this.authService.requestOtp(payload);
  }

  //@UseGuards(AuthGuard)
  @Get('refresh-token/:randomToken')
  async refreshToken(@Param('randomToken') randomToken: string) {
    return await this.authService.refreshToken(randomToken);
  }

  @Get('google')
  @UseGuards(Guard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(Guard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { accessToken } = await this.authService.googleAuth(req.user);
    return res.redirect(`https://pedxo.com/auth/success?token=${accessToken}`);
  }

  @Get('github')
  @UseGuards(Guard('github'))
  async githubAuth(@Req() req) {}

  @Get('github/redirect')
  @UseGuards(Guard('github'))
  async githubAuthRedirect(@Req() req, @Res() res) {
    const { accessToken } = await this.authService.githubAuth(req.user);
    return res.redirect(`https://pedxo.com/auth/success?token=${accessToken}`);
  }
}
