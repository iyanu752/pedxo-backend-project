import { Module } from '@nestjs/common';
import { HireController } from './hire.controller';
import { HireService } from './hire.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Hire, HireSchema } from './schemas/hire.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hire.name, schema: HireSchema }]),
  ],
  controllers: [HireController],
  providers: [HireService],
  exports: [HireService],
})
export class HireModule {}
