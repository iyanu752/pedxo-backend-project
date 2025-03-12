import { Module } from '@nestjs/common';
import { OutSourceService } from './outsource.service';
import { OutSourceController } from './outsource.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OutSource, OutSourceSchema } from './schema/outsource.schema';
import { EmailService } from 'src/common/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OutSource.name, schema: OutSourceSchema },
    ]),
  ],
  controllers: [OutSourceController],
  providers: [OutSourceService,EmailService],
})
export class OutSourceModule {}
