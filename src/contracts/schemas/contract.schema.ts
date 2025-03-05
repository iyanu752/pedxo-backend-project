import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContractDocument = Contract & Document;

@Schema({ timestamps: true })
export class Contract {
  @Prop({ required: true })
  clientName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  location: string;

  @Prop()
  region?: string;

  @Prop()
  roleTitle?: string;

  @Prop()
  seniorityLevel?: string;

  @Prop({ required: true })
  scopeOfWork: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate?: Date;

  @Prop({ required: true })
  paymentRate: number;

  @Prop({ required: true })
  paymentFrequency: string;

  @Prop()
  signature?: string; // Base64 or URL to saved signature image

  @Prop({ default: 'personal-info' }) // Tracks progress
  progress: 'personal-info' | 'job-details' | 'compensation' | 'review' | 'signed';

  @Prop({ default: false }) // Marks contract as completed
  isCompleted: boolean;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
