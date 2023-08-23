import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!permissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    const user = this.jwtService.verify(token);

    
  }
}
