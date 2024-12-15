import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
export type ContractDocument = Contract & Document;
@Schema({ timestamps: true })
export class Contract {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  country: string;

  @Prop({ required: true, type: String })
  region: string;

  @Prop({ type: String })
  role: string;

  @Prop({ type: String })
  level: string;

  @Prop({ type: String })
  scope: string;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({ required: true, type: String })
  explanation: string;

  @Prop({ required: true, type: Number })
  paymentAmount:string;
  
  @Prop({})
  paymentFrequency: string;

  //this is going to be an image
  @Prop({})
  signatureUrl: string;

  @Prop({})
  cloudinaryPublicId:string;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
