// src/talents/schemas/talent-details.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ExperiencedLevel } from '../enum/talent.enum';

export type TalentDetailsDocument = TalentDetails & Document;

@Schema({ timestamps: true })
export class TalentDetails {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, unique: true })
  talentId: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  roleTitle: string;

  @Prop({ type: String, required: true })
  country: string;

  @Prop({ type: String, required: true })
  state: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true })
  gender: string;

  @Prop({ type: String, required: true })
  bankName: string;

  @Prop({ type: String, required: true })
  accountNumber: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ type: String, required: true, enum: ExperiencedLevel })
  experienceLevel: ExperiencedLevel;

  @Prop({ type: String })
  githubAccount?: string;

  @Prop({ type: String, required: true })
  portfolioLink: string;

  @Prop({ type: String, required: true })
  whatsappNumber: string;
}

export const TalentDetailsSchema = SchemaFactory.createForClass(TalentDetails);
