import { Controller, Body, Post, Get } from '@nestjs/common';
import { CreateRoleDto } from './dtos/roles.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  createRole(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @Get()
  getRole() {
    return this.roleService.getRoles();
  }
}
