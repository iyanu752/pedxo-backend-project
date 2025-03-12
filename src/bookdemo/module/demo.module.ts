import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookDemo, BookDemoSchema } from '../schema/demo.schema';
import { BookDemoController } from '../controller/demo.controller';
import { BookDemoService } from '../service/demo.service';
import { EmailService } from 'src/common/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BookDemo.name, schema: BookDemoSchema },
    ]),
  ],
  controllers: [BookDemoController],
  providers: [BookDemoService,EmailService],
})
export class BookDemoModule {}
