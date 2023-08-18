import { CreateUserEvent } from './../../../google-login/src/test/create-user.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/auth.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/dto/user.dto';
import { Role } from 'src/roles/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async getUsers() {
    return await this.userRepository.find({
      relations: {
        role: true,
      },
    });
  }

  async updateUser(user: CreateUserDto, id: number) {
    const todo = await this.userRepository.findOne({ where: { id } });
    const existedRoleList = [];

    for (let i = 0; i < user.role.length; i++) {
      const existedRole = await this.roleRepository.findOne({
        where: {
          id: Number(user.role[i]),
        },
      });

      existedRoleList.push(existedRole);
    }
    user.role = existedRoleList;

    Object.assign(todo, user);

    return await this.userRepository.save(todo);
  }

  handleUserCreated(data: CreateUserEvent) {
    console.log('communicate', data);
  }
}
