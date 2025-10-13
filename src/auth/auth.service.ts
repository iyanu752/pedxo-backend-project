import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDTO } from '../user/dto/create.user.dto';
import { comparedHashed, HashData } from 'src/common/hashed/hashed.data';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from './dto/login.user.dto';
import { UserService } from 'src/user/user.service';
import { OtpService } from '../otp/service/otp.service';
import {
  ForgetPasswordDto,
  RequestOtpDto,
  ResetPasswordDto,
  VerifyEmailDto,
  VerifyForgetPasswordDto,
} from './dto/auth.dto';
import { OtpType } from 'src/otp/enum/opt.type.enum';
import { ENVIRONMENT } from 'src/common/constant/enivronment/enviroment';
import { User } from 'src/user/schema/user.schema';
import { generateRandomTokenForLoggedIn } from 'src/common/constant/generate.string';
import { user } from 'src/user/dto/user.dto';
import { LoginAdminDto } from 'src/admin/dto/admin.dto';
import { AdminService } from 'src/admin/admin.service';
import { googleAuth } from './interface/utility-interface';
import { AuthProvider } from 'src/user/enum/auth-provider.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
    private otpService: OtpService,
    private adminService: AdminService,
  ) {}

  //sign up account endpoint
  async create(body: CreateUserDTO) {
    const { email } = body;
    const userExist = await this.userService.checkIfUserExists(email);

    if (userExist) {
      if (userExist.email === email) {
        throw new UnprocessableEntityException('Email already exists');
      }
    }

    return await this.userService.registerUser(body);
  }

  //Log in endpoint

  async login(body: LoginUserDTO) {
    const { email, password } = body;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    if ((await comparedHashed(password, user.password)) === false) {
      throw new BadRequestException('Invalid Credentials');
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException(
        'You have to verify you account before logging in',
      );
    }

    const randomToken = await generateRandomTokenForLoggedIn();

    const token = await this.token(user);
    const accessToken = token.accessToken;
    const refreshToken = token.refreshToken;
    user.refreshToken = refreshToken;
    user.randomToken = randomToken;
    await user.save();
    return {
      name: 'khaldi',
      result: user,
      accessToken,
    };
  }

  async verifyEmail(payload: VerifyEmailDto) {
    const { email, code } = payload;

    const user = await this.userService.findUserByEmail(email);

    await this.otpService.verifyOTP({
      email: email,
      code: code,
      type: OtpType.EMAIL_VERIFICATION,
    });

    if (user.isEmailVerified) {
      throw new BadRequestException('Your account is verify already');
    }

    user.isEmailVerified = true;

    await user.save();

    return 'Account is now verified';
  }

  async forgotPassword(payload: ForgetPasswordDto) {
    const { email } = payload;

    const user = await this.userService.findUserByEmail(email);

    await this.otpService.sendOtp({
      email: email,
      type: OtpType.RESET_PASSWORD,
    });

    return `Otp send, kindly check your email`;
  }

  async verifyPasswordOtp(payload: VerifyForgetPasswordDto) {
    const { code } = payload;

    const otp = await this.otpService.verifyOTP({
      code: code,
      type: OtpType.RESET_PASSWORD,
    });

    if (otp) {
      return 'success';
    }
  }

  async resetPassword(payload: ResetPasswordDto) {
    const { email, password } = payload;

    const user = await this.userService.findUserByEmail(email);

    const hashedPassword = await HashData(password);
    user.password = hashedPassword;

    await user.save();

    return `Password Change Successfully`;
  }
  async requestOtp(payload: RequestOtpDto) {
    const { email, type } = payload;

    const user = await this.userService.findUserByEmail(email);

    const otp = await this.otpService.sendOtp({
      email: user.email,
      type: type,
    });
    return otp;
  }
  async token(payload: any) {
    payload = {
      userName: payload.userName,
      _id: payload._id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: ENVIRONMENT.JWT.JWT_SECRET,
        expiresIn: ENVIRONMENT.JWT.EXPIRATION_TIME,
      }),
      this.jwt.signAsync(payload, {
        secret: ENVIRONMENT.JWT.JWT_REFRESH_SECRET,
        expiresIn: ENVIRONMENT.JWT.JWT_REFRESH_EXP_TIME,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(randomToken: string) {
    try {
      const user = await this.userService.findUserByToken(randomToken);

      if (!user || !user.refreshToken) {
        throw new BadRequestException('Invalid request');
      }

      const token = await this.token(user);
      return token.accessToken;
    } catch (e) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  // Inside AuthService
  async loginAdmin(body: LoginAdminDto) {
    const { email, password } = body;
    const admin = await this.adminService.findByEmail(email);

    if (!admin) {
      return { error: true, message: 'Admin not found', data: null };
    }

    if (!(await comparedHashed(password, admin.password))) {
      return { error: true, message: 'Invalid credentials', data: null };
    }

    if (!admin.isActive) {
      return { error: true, message: 'Admin account is inactive', data: null };
    }

    const token = await this.jwt.signAsync(
      {
        adminId: admin._id,
        email: admin.email,
        role: 'admin',
      },
      {
        secret: ENVIRONMENT.JWT.JWT_SECRET,
        expiresIn: ENVIRONMENT.JWT.EXPIRATION_TIME,
      },
    );

    return {
      error: false,
      message: 'Login successful',
      data: {
        admin,
        token,
      },
    };
  }

  async googleAuth(googleUser: googleAuth) {
    const { email, firstName, lastName } = googleUser;

    if (!email) {
      throw new BadRequestException('Google account has no email');
    }

    let user = await this.userService.checkIfUserExists(email);

    if (!user) {
      // Register new Google user
      const payload = {
        firstName,
        lastName,
        email,
        provider: AuthProvider.GOOGLE,
        profilePic: googleUser.profilePic,
      };

      const { googleUser: createdUser } =
        await this.userService.registerGoogleUser(payload);
      user = createdUser;
    }

    // Always refresh tokens when signing in
    const randomToken = await generateRandomTokenForLoggedIn();
    const tokens = await this.userService.generateAuthTokens(user);
    user.refreshToken = tokens.refreshToken;
    user.accessToken = tokens.accessToken;
    user.randomToken = randomToken;
    await user.save();
    return {
      user,
      accessToken: tokens.accessToken,
    };
  }

  async githubAuth(githubUser: googleAuth) {
    const { email, firstName, lastName } = githubUser;

    if (!email) {
      throw new BadRequestException('Account has no email');
    }

    let user = await this.userService.checkIfUserExists(email);

    if (!user) {
      // Register user
      const payload = {
        firstName,
        lastName,
        email,
        provider: AuthProvider.GITHUB,
        profilePic: githubUser.profilePic,
      };

      const { githubUser: createdUser } =
        await this.userService.registerGithubUser(payload);
      user = createdUser;
    }

    // Always refresh tokens when signing in
    const randomToken = await generateRandomTokenForLoggedIn();
    const tokens = await this.userService.generateAuthTokens(user);
    user.refreshToken = tokens.refreshToken;
    user.accessToken = tokens.accessToken;
    user.randomToken = randomToken;
    await user.save();
    return {
      user,
      accessToken: tokens.accessToken,
    };
  }
}
