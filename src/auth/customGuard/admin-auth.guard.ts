// src/auth/guards/admin-auth.guard.ts
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from './guard.custom'; // your existing guard

@Injectable()
export class AdminAuthGuard extends AuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First, run the original AuthGuard to validate JWT and set request.user
    const canActivate = await super.canActivate(context);
    if (!canActivate) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if the user has admin role
    if (user.role !== 'admin') {
      throw new ForbiddenException('Access denied: Admins only');
    }

    return true;
  }
}
