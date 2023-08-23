import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Permission } from './permission.entity';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dtos/permissions.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
  ) {}

  async createPermission(dto: CreatePermissionDto) {
    const existedPermission = await this.permissionRepository.find({
      where: {
        permission: dto.permission,
      },
    });

    if (existedPermission.length === 0) {
      const todo = await this.permissionRepository.create(dto);

      return await this.permissionRepository.save(todo);
    } else {
      throw new HttpException('Permission is existed', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  async getPermissions() {
    return await this.permissionRepository.find();
  }
}
