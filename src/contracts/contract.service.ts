import { BadRequestException, Injectable,Inject} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contract, ContractDocument } from './schemas/contract.schema';
import { Model } from 'mongoose';
import { contractCreateDto} from './dto/contract.dto';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract.name)
    private contractModel: Model<ContractDocument>,
    private readonly cloudinary : CloudinaryService
  ) {}
  async createContract(file:Express.Multer.File, contractDetails:contractCreateDto) {
    try {
      let result = await this.cloudinary.uploadFile(file,"signatures")
      // console.log("Second result:",result)
     
      const contract =  await this.contractModel.create({
        ...contractDetails,
        signatureUrl: result.secure_url,
      });
      if (!contract) {
        throw new BadRequestException('Error occur while creating contract');
      }
      return await contract.save();
    } catch (error) {
      throw new Error(`Error creating contract: ${error.message}  ${error}`);
    }
  }
}
