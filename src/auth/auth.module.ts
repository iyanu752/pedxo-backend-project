import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from 'src/user/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './customGuard/guard.custom';
import { UserModule } from 'src/user/user.module';
import { OtpModule } from 'src/otp/otp.module';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { ENVIRONMENT } from 'src/common/constant/enivronment/enviroment';
import { JWTAuthGuard } from './customGuard/jwt.guard';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AdminService } from 'src/admin/admin.service';
import { TalentService } from 'src/talent/talent.service';
import { Talent, TalentSchema } from 'src/talent/schemas/talent.schema';
import {
  TalentDetails,
  TalentDetailsSchema,
} from 'src/talent/schemas/talent-details.schema';
import { TalentDetailsRepository } from 'src/talent/repository/talent-details.repository';
import { AdminModule } from 'src/admin/admin.module';
import { HireService } from 'src/hire/hire.service';
import { Hire, HireSchema } from 'src/hire/schemas/hire.schema';
import { ContractService } from 'src/contracts/contract.service';
import {
  Contract,
  ContractSchema,
} from 'src/contracts/schemas/contract.schema';
import { EmailService } from 'src/common/email.service';
import { Admin, AdminSchema } from 'src/admin/schemas/admin.schema';
import { GoogleStrategy } from './strategy/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { TokenService } from 'src/talent/token.service';
import { FormToken, FormTokenSchema } from 'src/talent/schemas/token.schema';
import {GithubStrategy} from './strategy/github.strategy'

//module decorator
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Talent.name, schema: TalentSchema },
      { name: TalentDetails.name, schema: TalentDetailsSchema },
      { name: Hire.name, schema: HireSchema },
      { name: Contract.name, schema: ContractSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: FormToken.name, schema: FormTokenSchema },
    ]),
    {
      ...JwtModule.register({
        secret: ENVIRONMENT.JWT.JWT_SECRET,
        signOptions: { expiresIn: ENVIRONMENT.JWT.EXPIRATION_TIME },
      }),
      global: true,
    },
    UserModule,
    OtpModule,
    AdminModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    TalentService,
    EmailService,
    TokenService,
    HireService,
    ContractService,
    AdminService,
    TalentDetailsRepository,
    RefreshTokenStrategy,
    JWTAuthGuard,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
