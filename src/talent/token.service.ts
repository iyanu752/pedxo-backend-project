import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';
import { FormToken } from './schemas/token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(FormToken.name) private tokenModel: Model<FormToken>,
  ) {}

  async generateToken(): Promise<string> {
    const token = randomBytes(16).toString('hex'); // 32-char random string
    const expiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 mins

    await this.tokenModel.create({ value: token, expiresAt });
    return token;
  }

  async validateToken(token: string): Promise<boolean> {
    const found = await this.tokenModel.findOne({ value: token });
    if (!found) return false;
    if (found.expiresAt < new Date()) return false;
    return true;
  }

  async invalidateToken(token: string): Promise<void> {
    await this.tokenModel.deleteOne({ value: token });
  }
}
