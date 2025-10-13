import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ENVIRONMENT } from 'src/common/constant/enivronment/enviroment';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('not unauthorized');
    }

    const secret =
      this.config.get<string>('JWT_SECRET') ?? ENVIRONMENT.JWT.JWT_SECRET;

    const payload = await this.jwtService.verifyAsync(token, {
      secret,
    });

    request.user = payload;
    return true;
  }

  //please note the space in between the splite is very import.. without the space code won't work
  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
