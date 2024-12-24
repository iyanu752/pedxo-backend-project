// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import { Inject } from '@nestjs/common';

@Injectable()
export class CloudinaryService {
 async uploadFile(file: Express.Multer.File,folderName:string): Promise<CloudinaryResponse> {
    return await cloudinary.uploader.upload(file.path,{folder:folderName})
  }
}
