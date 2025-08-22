import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from 'src/user/schema/user.schema';
import { UserModule } from 'src/user/user.module';
import { TalentModule } from 'src/talent/talent.module';
import { HireModule } from 'src/hire/hire.module';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { AuthService } from 'src/auth/auth.service';
import { OtpService } from 'src/otp/service/otp.service';
import { OTP, OtpSchema } from 'src/otp/schema/otp.schema';
import { EmailService } from 'src/common/email.service';
import { TokenService } from 'src/talent/token.service';
import { FormToken, FormTokenSchema } from 'src/talent/schemas/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: OTP.name, schema: OtpSchema },
      { name: FormToken.name, schema: FormTokenSchema },
    ]),
    UserModule,
    TalentModule,
    HireModule,
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    AuthService,
    TokenService,
    EmailService,
    OtpService,
  ],
})
export class AdminModule {}
