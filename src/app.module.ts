import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TalentModule } from './talent/talent.module';
import { HireModule } from './hire/hire.module';
import { AdminModule } from './admin/admin.module';
import { OtpModule } from './otp/otp.module';
import { OutSourceModule } from './outsource/outsource.module';
import { BookDemoModule } from './bookdemo/module/demo.module';
import { ContractModule } from './contracts/contract.module';
import { CloudinaryService } from './s3service/s3service.service';
import { S3serviceModule } from './s3service/s3service.module';
import * as dotenv from 'dotenv';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
    UserModule,
    AuthModule,
    TalentModule,
    HireModule,
    AdminModule,
    OtpModule,
    OutSourceModule,
    BookDemoModule,
    ContractModule,
    S3serviceModule,
  ],
  controllers: [],
  providers: [CloudinaryService],
})
export class AppModule {}
