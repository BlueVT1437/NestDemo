import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, LoginDto } from 'src/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.signIn(dto);
  }

  @Post('register')
  register(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
		console.log('req', req);
	}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const accessToken = await this.authService.googleLogin(req);
		res.redirect(`http://localhost:3001/auth?accessToken=${accessToken}`);
  }
}
