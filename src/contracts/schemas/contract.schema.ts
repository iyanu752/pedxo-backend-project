import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { Document } from 'mongoose';

export type ContractDocument = Contract & Document;

@Schema({ timestamps: true })
export class Contract {
  @Prop({ type: String, default: null })
  userId: string;

  @Prop({ required: true })
  clientName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  country: string;

  @Prop()
  region?: string;

  @Prop()
  companyName: string;

  @Prop()
  contractType: string;

  @Prop()
  roleTitle?: string;

  @Prop()
  seniorityLevel?: string;

  @Prop()
  scopeOfWork: string;

  @Prop()
  explanationOfScopeOfWork: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate?: Date;

  @Prop()
  paymentRate: number;

  @Prop()
  paymentFrequency: string;

  @Prop()
  signature?: string; // Base64 or URL to saved signature image

  @Prop({ default: 'personal-info', enum: ['personal-info', 'job-details', 'compensation', 'review', 'signed'] }) // Tracks progress
  progress:
    | 'personal-info'
    | 'job-details'
    | 'compensation'
    | 'review'
    | 'signed';

  @Prop({ default: false }) // Marks contract as completed
  isCompleted: boolean;

  @Prop({ type: [String] })
  talentAssignedId?: string[];
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
