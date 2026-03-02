import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // // 1. Check cookie first
    // let token = request.cookies?.access_token;

    // // 2. If no cookie, fallback to Bearer token
    // if (!token) {
    //   const authHeader = request.headers['authorization'];
    //   if (!authHeader) {
    //     throw new UnauthorizedException('Unauthorized: No token provided');
    //   }

    //   token = authHeader.split(' ')[1];
    //   if (!token) {
    //     throw new UnauthorizedException('Unauthorized: Invalid token format');
    //   }
    // }

    const authHeader = request.headers.authorization;

    let token: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (request.cookies?.access_token) {
      token = request.cookies.access_token;
    }

    try {
      const secretKey = process.env.JWT_SECRET;
      const decodedToken = await this.jwtService.verifyAsync(token, {
        secret: secretKey,
      });

      // console.log('Decoded JWT Token:', decodedToken);
      const userId =
        decodedToken._id || decodedToken.userId || decodedToken.sub;

      if (!userId) {
        throw new UnauthorizedException('Token missing user id');
      }

      request.user = {
        _id: userId,
        email: decodedToken.email,
      };

      return true;
    } catch (error) {
      console.error('JWT Verification Error:', error);
      throw new UnauthorizedException('Unauthorized: Invalid or expired token');
    }
  }
}
