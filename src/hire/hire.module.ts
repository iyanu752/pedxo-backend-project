import { Module } from '@nestjs/common';
import { HireController } from './hire.controller';
import { HireService } from './hire.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Hire, HireSchema } from './schemas/hire.schema';
import { TalentDetailsRepository } from 'src/talent/repository/talent-details.repository';
import {
  TalentDetails,
  TalentDetailsSchema,
} from 'src/talent/schemas/talent-details.schema';
import { ContractService } from 'src/contracts/contract.service';
import {
  Contract,
  ContractSchema,
} from 'src/contracts/schemas/contract.schema';
import { EmailService } from 'src/common/email.service';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { OtpService } from 'src/otp/service/otp.service';
import { CloudinaryService } from 'src/s3service/s3service.service';
import { OTP, OtpSchema } from 'src/otp/schema/otp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hire.name, schema: HireSchema },
      { name: TalentDetails.name, schema: TalentDetailsSchema },
      { name: Contract.name, schema: ContractSchema },
      { name: User.name, schema: UserSchema },
      { name: OTP.name, schema: OtpSchema },
    ]),
  ],
  controllers: [HireController],
  providers: [
    HireService,
    EmailService,
    UserService,
    OtpService,
    CloudinaryService,
    ContractService,
    TalentDetailsRepository,
  ],
  exports: [HireService],
})
export class HireModule {}
