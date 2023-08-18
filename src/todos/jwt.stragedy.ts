import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './../auth/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus } from '@nestjs/common';

export class JwtStragedy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'gicungduoc',
    });
  }

  async validate({ email, password }) {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
