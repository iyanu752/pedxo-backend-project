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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hire.name, schema: HireSchema },
      { name: TalentDetails.name, schema: TalentDetailsSchema },
      { name: Contract.name, schema: ContractSchema },
    ]),
  ],
  controllers: [HireController],
  providers: [
    HireService,
    EmailService,
    ContractService,
    TalentDetailsRepository,
  ],
  exports: [HireService],
})
export class HireModule {}
