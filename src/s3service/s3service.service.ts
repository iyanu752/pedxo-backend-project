import { BadRequestException, Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import imageType from 'image-type';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    // console.log('file', file)
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp'];
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
        message: 'Only PNG and JPEG files are allowed',
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

    const type = await imageType(new Uint8Array(file.buffer));
    if (!type || !['png', 'jpg', 'webp'].includes(type.ext)) {
      throw new BadRequestException({
        error: true,
        message: 'file is not a valid imageType',
        data: null,
      });
    }

    const ext = file.originalname.split('.').pop()?.toLowerCase();
    const mimeToExt: { [key: string]: string } = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/webp': 'webp',
    };
    if (ext !== mimeToExt[file.mimetype]) {
      throw new BadRequestException({
        error: true,
        message: 'file extension does not match MIME type',
        data: null,
      });
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: 'image', folder: 'images' },
          (error, result) => {
            if (error || !result) {
              return reject(
                new BadRequestException({
                  error: true,
                  message: 'Cloudinary upload failed',
                  data: null,
                }),
              );
            }
            return resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }
}
