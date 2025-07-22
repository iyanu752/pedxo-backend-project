import { Module } from '@nestjs/common';
import { CloudinaryService } from './s3service.service';

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService], // Export S3Service if other modules need it
})
export class S3serviceModule {}
