import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    // console.log('file', file)
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    if (!file) {
      throw new BadRequestException({
        error: true,
        message: 'File is required',
        data: null,
      });
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException({
        error: true,
        message: 'Only PNG, JPEG, and SVG files are allowed',
        data: null,
      });
    }

    if (file.size > maxFileSize) {
      throw new BadRequestException({
        error: true,
        message: 'File size exceeds the limit of 2MB',
        data: null,
      });
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: 'raw' }, (error, result) => {
          if (error) {
            return reject(
              new BadRequestException({
                error: true,
                message: 'Cloudinary upload failed',
                data: null,
              }),
            );
          }
          return resolve(result.secure_url);
        })
        .end(file.buffer);
    });
  }
}
