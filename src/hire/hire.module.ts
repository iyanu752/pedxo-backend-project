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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hire.name, schema: HireSchema },
      { name: TalentDetails.name, schema: TalentDetailsSchema },
    ]),
  ],
  controllers: [HireController],
  providers: [HireService, TalentDetailsRepository],
  exports: [HireService],
})
export class HireModule {}
