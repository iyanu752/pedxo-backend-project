import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { BuildSomePart, WantTalentAs, WorkStartDate } from '../enum/hire.enum';

@Schema({ timestamps: true })
export class Hire extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  contractId: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  whereYouLive: string;

  @Prop({ type: String, required: true })
  state: string;
  @Prop({ type: String, required: true })
  country: string;
  //role
  @Prop({ type: String })
  YourTitle: string;

  @Prop({ type: String, enum: BuildSomePart, required: true }) ///enum
  haveYouBuildSomePart: BuildSomePart;

  @Prop({ type: String, enum: WorkStartDate, required: true }) //enum
  workStartDate: WorkStartDate;

  @Prop({ type: String, enum: WantTalentAs, required: true }) //enum
  wantTalentAs: WantTalentAs;

  @Prop({ type: String })
  paymentPattern: string;
  @Prop({ type: String })
  yourCurrentJob: string;
  @Prop({ type: String })
  minimumToPayToTalent: string;
  @Prop({ type: String })
  website: string;
  @Prop({ type: String })
  githubLink: string;
  @Prop({ type: String })
  linkedIn: string;
  @Prop({ type: String })
  twitterLink: string;

  @Prop({ type: [String] })
  talentAssignedId?: string[];

  @Prop({ type: Boolean, default: false })
  wasHired: boolean;
}

export const HireSchema = SchemaFactory.createForClass(Hire);
