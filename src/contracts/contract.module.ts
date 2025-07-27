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
@Module({
  imports: [
    AuthModule,
    JwtModule,
    MongooseModule.forFeature([
      { name: Contract.name, schema: ContractSchema },
    ]),
    S3serviceModule,
  ],
  controllers: [ContractController],
  providers: [ContractService, EmailService],
})
export class ContractModule {}
