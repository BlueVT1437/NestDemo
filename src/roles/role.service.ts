import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dtos/roles.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async createRole(dto: CreateRoleDto) {
    const existedRole = await this.roleRepository.find({
      where: {
        role: dto.role,
      },
    });

    if (existedRole.length === 0) {
      const todo = await this.roleRepository.create(dto);

      return await this.roleRepository.save(todo);
    } else {
      throw new HttpException('Role is existed', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  async getRoles() {
    return await this.roleRepository.find();
  }
}
