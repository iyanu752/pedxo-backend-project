import { Module } from '@nestjs/common';
import { TalentController } from './talent.controller';
import { TalentService } from './talent.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Talent, TalentSchema } from './schemas/talent.schema';
import { UserModule } from '../user/user.module';
import {
  TalentDetails,
  TalentDetailsSchema,
} from './schemas/talent-details.schema';
import { TalentDetailsRepository } from './repository/talent-details.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Talent.name, schema: TalentSchema },
      { name: TalentDetails.name, schema: TalentDetailsSchema },
    ]),
    UserModule,
  ],

  controllers: [TalentController],
  providers: [TalentService, TalentDetailsRepository],
  exports: [TalentService],
})
export class TalentModule {}
