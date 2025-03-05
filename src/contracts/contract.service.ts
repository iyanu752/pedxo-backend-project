import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contract, ContractDocument } from './schemas/contract.schema';
import { PersonalInfoDto } from './dto/personal-info.dto';
import { JobDetailsDto } from './dto/job-details.dto';
import { CompensationDto } from './dto/compensation.dto';
import { SignatureDto } from './dto/signature.dto';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract.name)
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    private readonly cloudinary : CloudinaryService
  ) {}
  async createOrUpdatePersonalInfo(dto: PersonalInfoDto) {
    let contract = await this.contractModel.findOne({ email: dto.email });

    if (!contract) {
      contract = new this.contractModel({ ...dto, progress: 'job-details' });
      return contract.save();
    }

    contract.clientName = dto.clientName;
    contract.location = dto.location;
    contract.region = dto.region ?? contract.region;
    contract.progress = 'job-details';

    return contract.save();
  }

  async updateJobDetails(email: string, dto: JobDetailsDto) {
    return this.updateContract(email, dto, 'compensation');
  }

  async updateCompensation(email: string, dto: CompensationDto) {
    return this.updateContract(email, dto, 'review');
  }

  async submitSignature(dto: SignatureDto) {
    const contract = await this.contractModel.findOneAndUpdate(
      { email: dto.email },
      { $set: { signature: dto.signature, progress: 'signed' } },
      { new: true }
    );

    if (!contract) throw new NotFoundException('Contract not found');
    return contract;
  }

  async finalizeContract(email: string) {
    const contract = await this.contractModel.findOneAndUpdate(
      { email },
      { $set: { isCompleted: true } },
      { new: true }
    );

    if (!contract) throw new NotFoundException('Contract not found');
    return contract;
  }

  private async updateContract(email: string, dto: any, nextProgress: string) {
    const contract = await this.contractModel.findOneAndUpdate(
      { email },
      { $set: { ...dto, progress: nextProgress } },
      { new: true }
    );

    if (!contract) throw new NotFoundException('Contract not found');
    return contract;
  }

  async getContract(email: string) {
    const contract = await this.contractModel.findOne({ email });
    if (!contract) throw new NotFoundException('Contract not found');
    return contract;
  }
  // async createContract(file:Express.Multer.File, contractDetails:contractCreateDto) {
  //   try {
  //     let result = await this.cloudinary.uploadFile(file,"signatures")
  //     // console.log("Second result:",result)
     
  //     const contract =  await this.contractModel.create({
  //       ...contractDetails,
  //       signatureUrl: result.secure_url,
  //     });
  //     if (!contract) {
  //       throw new BadRequestException('Error occur while creating contract');
  //     }
  //     return await contract.save();
  //   } catch (error) {
  //     throw new Error(`Error creating contract: ${error.message}  ${error}`);
  //   }
  // }
}
