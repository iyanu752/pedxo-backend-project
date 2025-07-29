import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TalentDetails,
  TalentDetailsDocument,
} from '../schemas/talent-details.schema';

@Injectable()
export class TalentDetailsRepository {
  constructor(
    @InjectModel(TalentDetails.name)
    private model: Model<TalentDetailsDocument>,
  ) {}

  async create(data: Partial<TalentDetails>): Promise<TalentDetails> {
    return this.model.create(data);
  }

  async findAll(): Promise<TalentDetails[]> {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<TalentDetails | null> {
    return this.model.findById(id).exec();
  }

  async findByEmail(email: string): Promise<TalentDetails | null> {
    return this.model.findOne({ email }).exec();
  }

  async findByTalentId(talentId: string): Promise<TalentDetails | null> {
    return this.model.findOne({ talentId }).exec();
  }

  async updateById(
    id: string,
    update: Partial<TalentDetails>,
  ): Promise<TalentDetails | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async deleteById(id: string): Promise<TalentDetails | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
