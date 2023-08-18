import { EventPattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { CreateUserEvent } from '../../../google-login/src/test/create-user.event';
import { CreateUserDto } from 'src/dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: CreateUserDto) {
    return this.userService.updateUser(dto, id);
  }

  @EventPattern('mail_created')
  handleUserCreated(data: CreateUserEvent) {
    this.userService.handleUserCreated(data);
  }
}
