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
import { TokenService } from './token.service';
import { FormToken, FormTokenSchema } from './schemas/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Talent.name, schema: TalentSchema },
      { name: FormToken.name, schema: FormTokenSchema },
      { name: TalentDetails.name, schema: TalentDetailsSchema },
    ]),
    UserModule,
  ],

  controllers: [TalentController],
  providers: [TalentService, TokenService, TalentDetailsRepository],
  exports: [TalentService, TokenService],
})
export class TalentModule {}
