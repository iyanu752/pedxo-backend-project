import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ContractTerminationDocument = ContractTermination & Document;

@Schema({ timestamps: true })
export class ContractTermination {
  @Prop({ type: Types.ObjectId, ref: 'Contract', required: true })
  contractId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Talent', required: true })
  talentId: Types.ObjectId;

  @Prop({ required: true })
  talentName: string;

  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  terminationReason: string;

  @Prop({ required: true, min: 1, max: 5 })
  performanceRating: number;

  @Prop()
  terminatedByEmail: string;
}

export const ContractTerminationSchema =
  SchemaFactory.createForClass(ContractTermination);
