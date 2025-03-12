import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OTP, OtpSchema } from './schema/otp.schema';
import { OtpService } from './service/otp.service';
import { EmailService } from 'src/common/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OTP.name, schema: OtpSchema }]),
  ],
  controllers: [],
  providers: [OtpService,EmailService],
  exports: [OtpService],
})
export class OtpModule {}
