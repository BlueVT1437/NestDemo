import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesContext = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const permissionsContext = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    const userRole = this.jwtService.verify(token)?.role;

    let condition = false;
    condition = userRole.some((itemRole) =>
      rolesContext.includes(itemRole.role),
    );
    if (!condition) {
      const userPermission = [];
      userRole.forEach((item) => {
        item.permissions.forEach((itemPermission) => {
          userPermission.push(itemPermission.permission);
        });
      });

      condition = userPermission.some((itemPermission) =>
        permissionsContext.includes(itemPermission),
      );
    }
    return condition;
  }
}
