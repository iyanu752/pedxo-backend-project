import { Expose, Type } from 'class-transformer';

export class UserDto {
  @Expose()
  _id: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  userName: string;

  @Expose()
  isTalent: boolean;

  @Expose()
  accessToken: string;

  @Expose()
  randomToken: string;

  @Expose()
  refreshToken: string;
}

export class user {
  @Expose()
  _id: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  userName: string;

  @Expose()
  isTalent: boolean;

  @Expose()
  randomToken: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
export class LoginResponse {
  @Expose()
  @Type(() => user)
  result: user;

  @Expose()
  accessToken: string;
}
export class AllUserDto {
  @Expose()
  _id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  userName: string;

  @Expose()
  isTalent: boolean;

  @Expose()
  isEmailVerified: boolean;
}
