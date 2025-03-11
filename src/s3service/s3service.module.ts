import { Module } from '@nestjs/common';
import { S3Service } from './s3service.service';

@Module({
  providers: [S3Service],
  exports: [S3Service], // Export S3Service if other modules need it
})
export class S3serviceModule{}
