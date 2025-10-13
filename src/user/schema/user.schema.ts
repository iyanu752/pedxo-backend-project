import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AuthProvider } from '../enum/auth-provider.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false })
  lastName?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String })
  accessToken?: string;

  @Prop({ type: String })
  randomToken?: string;

  @Prop({ type: String })
  refreshToken?: string;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({ required: false })
  password: string;

  @Prop({ type: Boolean, default: false })
  isSuspended: boolean;

  @Prop({ type: Boolean, default: false })
  isTalent: boolean;

  @Prop({
    type: String,
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
    nullable: false,
  })
  provider: AuthProvider;

  @Prop({ default: null })
  profilePic?: string;

  @Prop({ default: null })
  profilePicPublicId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
