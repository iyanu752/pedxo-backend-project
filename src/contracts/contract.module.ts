import { Module } from '@nestjs/common';
// import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';
import { Contract, ContractSchema } from './schemas/contract.schema';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { S3serviceModule } from 'src/s3service/s3service.module';
import { EmailService } from '../common/email.service';
import {
  TalentDetails,
  TalentDetailsSchema,
} from 'src/talent/schemas/talent-details.schema';
import { TalentDetailsRepository } from 'src/talent/repository/talent-details.repository';
import {
  ContractTermination,
  ContractTerminationSchema,
} from './schemas/contract-termination.schema';
@Module({
  imports: [
    AuthModule,
    JwtModule,
    MongooseModule.forFeature([
      { name: Contract.name, schema: ContractSchema },
      { name: TalentDetails.name, schema: TalentDetailsSchema },
      { name: ContractTermination.name, schema: ContractTerminationSchema },
    ]),
    S3serviceModule,
  ],
  controllers: [ContractController],
  providers: [ContractService, EmailService, TalentDetailsRepository],
})
export class ContractModule {}
