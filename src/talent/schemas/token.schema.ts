import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class FormToken extends Document {
  @Prop({ required: true, unique: true })
  value: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const FormTokenSchema = SchemaFactory.createForClass(FormToken);

// Ensure tokens auto-delete after expiry
FormTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
