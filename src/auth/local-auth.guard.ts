import { AuthGuard } from '@nestjs/passport';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private jwtService: JwtService) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException();
      }
      request.user = this.jwtService.verify(token);

      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
