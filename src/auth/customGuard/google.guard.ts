import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (request.query?.error) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();

    if (request.query?.error) {
      return null;
    }

    if (err || !user) {
      throw err || new Error('Authentication failed');
    }

    return user;
  }
}
