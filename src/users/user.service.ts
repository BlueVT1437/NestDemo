// import { CreateUserEvent } from './../../../google-login/src/test/create-user.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/auth.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/dto/user.dto';
import { Role } from 'src/roles/role.entity';
import * as bcrypt from 'bcrypt';

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

  async getUserById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async updateUser(user: CreateUserDto, id: number) {
    const todo = await this.userRepository.findOne({ where: { id } });
    const existedRoleList = [];

    if (user.role) {
      for (let i = 0; i < user.role.length; i++) {
        const existedRole = await this.roleRepository.findOne({
          where: {
            id: Number(user.role[i]),
          },
        });

        existedRoleList.push(existedRole);
      }
      user.role = existedRoleList;
    }

    Object.assign(todo, user);

    await this.userRepository.save(todo);
    return { message: 'Updated successfully' };
  }

  async deleteUser(id: number, isActive: boolean) {
    await this.userRepository.update({ id }, { status: isActive });
    return { message: 'Inactive account successfully' };
  }

  async updatePassword(id: number, password: string) {
    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltOrRounds);

    await this.userRepository.update({ id }, { password: hashPassword });
    return { message: 'Update password successfully' };
  }
}
