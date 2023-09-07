import { RegisterDto } from './../../api-gateway/src/dto/user.dto';
import { AuthService } from './auth/auth.service';
import { Controller, Res } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'login' })
  async login(value: any) {
    const access_token = await this.authService.signIn(value);
    return of(access_token);
  }

	@MessagePattern({ cmd: 'register' })
  async register(value: RegisterDto) {
    this.authService.register(value);
    return of(value);
  }
}
