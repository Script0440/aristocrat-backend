import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) return true; // если роли не указаны, доступ разрешён

    const request = context.switchToHttp().getRequest();
    const user = request.user; // приходит из JwtStrategy.validate()

    if (!user) return false;

    const hasRole = roles.includes(user.role);
    if (!hasRole) throw new ForbiddenException('Нет прав доступа');

    return true;
  }
}
