import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './customGuard/guard.custom';
import { UserModule } from 'src/user/user.module';
import { OtpModule } from 'src/otp/otp.module';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { ENVIRONMENT } from 'src/common/constant/enivronment/enviroment';
import { JWTAuthGuard } from './customGuard/jwt.guard';
import { JwtStrategy } from './strategy/jwt.strategy';

//module decorator
@Module({
  imports: [
    {
      ...JwtModule.register({
        secret: ENVIRONMENT.JWT.JWT_SECRET,
        signOptions: { expiresIn: ENVIRONMENT.JWT.EXPIRATION_TIME },
      }),
      global: true,
    },
    UserModule,
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RefreshTokenStrategy,JWTAuthGuard,JwtStrategy],
})
export class AuthModule {}
