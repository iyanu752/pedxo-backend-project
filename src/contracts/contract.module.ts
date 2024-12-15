import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';
import { Contract, ContractSchema } from './schemas/contract.schema';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import * as multer from 'multer';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contract.name, schema: ContractSchema },
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
    CloudinaryModule
  ],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
