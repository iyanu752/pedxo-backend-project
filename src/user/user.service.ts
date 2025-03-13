import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/create.user.dto';
import { HashData } from 'src/common/hashed/hashed.data';
import { UpdateUserDTO } from './dto/update.user.dto';
import { OtpService } from 'src/otp/service/otp.service';
import { OtpType } from 'src/otp/enum/opt.type.enum';
import { ENVIRONMENT } from 'src/common/constant/enivronment/enviroment';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private otpService: OtpService,
    private jwtService: JwtService,
  ) {}

  /**
   * Registers a new user, hashes their password, and sends an OTP for email verification.
   */
  async registerUser(payload: CreateUserDTO) {
    const { password } = payload;

    const hashedPassword = await HashData(password);

    const newUser = await this.userModel.create({
      ...payload,
      password: hashedPassword,
    });

    const tokenData = await this.generateAuthTokens(newUser);
    newUser.refreshToken = tokenData.refreshToken;
    newUser.accessToken = tokenData.accessToken;
    await newUser.save();

    await this.otpService.sendOtp({
      email: newUser.email,
      type: OtpType.EMAIL_VERIFICATION,
    });

    delete newUser['_doc'].password;
    return { newUser, accessToken: tokenData.accessToken };
  }

  /**
   * Fetches all users from the database.
   */
  async fetchAllUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  /**
   * Finds a user by email or username.
   */
  async checkIfUserExists(email?: string): Promise<User | null> {
    if (!email) {
      throw new Error("Either email or username must be provided");
    }

    return this.userModel.findOne({email}).exec();
  }

  /**
   * Updates a user's profile.
   */
  async updateUserProfile(updateData: UpdateUserDTO, user: User) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        user._id.toString(),
        { ...updateData },
        { new: true },
      );

      if (!updatedUser) {
        return { message: 'User not found or update failed.' };
      }

      return {
        message: `Profile successfully updated with the following changes: ${JSON.stringify(updateData)}`,
        updatedUser,
      };
    } catch (error) {
      return { message: `An error occurred during update: ${error.message}` };
    }
  }

  /**
   * Retrieves a user by their ID.
   */
  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Finds a user by a random token.
   */
  async findUserByToken(randomToken: string): Promise<User> {
    const user = await this.userModel.findOne({ randomToken });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Finds a user by email.
   */
  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Approves a user as a talent.
   */
  async approveUserAsTalent(userId: string) {
    return this.userModel.findOneAndUpdate(
      { _id: userId },
      { isTalent: true },
      { new: true },
    );
  }

  /**
   * Suspends a user.
   */
  async suspendUserAccount(userId: string) {
    return this.userModel.findOneAndUpdate(
      { _id: userId },
      { isSuspended: true },
      { new: true },
    );
  }

  /**
   * Removes suspension from a user.
   */
  async unsuspendUserAccount(userId: string) {
    return this.userModel.findOneAndUpdate(
      { _id: userId },
      { isSuspended: false },
      { new: true },
    );
  }

  /**
   * Deletes a user by their username.
   */
  async deleteUserByUsername(username: string) {
    const user = await this.userModel.findOneAndDelete({ userName: username });
    if (!user) {
      throw new NotFoundException(`User with username ${username} doesn't exist`);
    }
    return 'User deleted successfully';
  }

  /**
   * Generates authentication tokens (access and refresh tokens) for a user.
   */
  async generateAuthTokens(user: User) {
    const payload = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: ENVIRONMENT.JWT.JWT_SECRET,
        expiresIn: ENVIRONMENT.JWT.EXPIRATION_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: ENVIRONMENT.JWT.JWT_REFRESH_SECRET,
        expiresIn: ENVIRONMENT.JWT.JWT_REFRESH_EXP_TIME,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
