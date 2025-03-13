import { PartialType } from '@nestjs/swagger';
import { CreateUserDTO } from './create.user.dto';
import { Exclude } from 'class-transformer';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @Exclude()
  password: string;

  @Exclude()
  email: string;
}
