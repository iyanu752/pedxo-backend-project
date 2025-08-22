import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from 'src/talent/token.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.body.token;

    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    const valid = await this.tokenService.validateToken(token);
    if (!valid) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}
