import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // try {
    //   const request = context.switchToHttp().getRequest();
    //   const token = request.headers.authorization.split(' ')[1];
    //   console.log('token', token);

    //   if (!token) {
    //     throw new UnauthorizedException();
    //   }
    //   request.user = this.jwtService.verify(token);
    // } catch (err) {
    //   console.log('errr', err);
    //   throw new UnauthorizedException();
    // }
		console.log('asldlasd');
    return true;
  }
}
