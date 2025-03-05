import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class SignatureDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  signature: string; // Base64 or Image URL
}
