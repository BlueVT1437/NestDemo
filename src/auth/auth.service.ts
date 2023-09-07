import { ProducerService } from './../kafka/producer.service';
import { CreateUserDto, LoginDto } from 'src/dto/user.dto';
import { JwtService } from '@nestjs/jwt/dist';
import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { User } from './auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isEmpty } from 'class-validator';
import { Role } from 'src/roles/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    // @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
    private readonly producerService: ProducerService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne(email as any);

    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(user: CreateUserDto) {
    const existedUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (!isEmpty(existedUser)) {
      throw new HttpException('Existed email', HttpStatus.NOT_ACCEPTABLE);
    } else {
      const existedRoleList = [];

      for (let i = 0; i < user.role.length; i++) {
        const existedRole = await this.roleRepository.findOne({
          where: {
            id: Number(user.role[i]),
          },
        });

        if (isEmpty(existedRole)) {
          throw new HttpException('Not found role', HttpStatus.NOT_FOUND);
        } else {
          existedRoleList.push(existedRole);
        }
      }

      const saltOrRounds = 10;
      const hashPassword = await bcrypt.hash(user.password, saltOrRounds);
      const userInfo = {
        name: user.name,
        email: user.email,
        password: hashPassword,
        role: existedRoleList,
        status: true,
      };
      const newUser = this.userRepository.create(userInfo);

      return await this.userRepository.save(newUser);
    }
  }

  async signIn({ email, password }: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: {
        role: {
          permissions: true,
        },
      },
    });

    try {
      const isMatch = bcrypt.compareSync(password, user?.password);

      if (!isMatch || !user.status) {
        throw new UnauthorizedException();
      }
      const payload = { sub: user.name, username: user.email, role: user.role };
      const access_token = await this.jwtService.signAsync(payload);

      return { access_token, user };
    } catch (err) {
      // console.log(`Error is: ${err}`);
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Please check your email or password!',
        },
        HttpStatus.UNAUTHORIZED,
        {
          cause: err,
        },
      );
    }
  }

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    const userInfo = {
      name: req.user.email.split('@')[0],
      email: req.user.email,
      password: '',
    };

    const existedUser = await this.userRepository.findOne({
      where: { email: userInfo.email },
    });

    if (isEmpty(existedUser)) {
      const newUser = await this.userRepository.create({
        ...userInfo,
        role: [
          {
            id: 2,
          },
        ],
      });

      await this.userRepository.save(newUser);
    }

    const payload = { sub: userInfo.name, username: userInfo.email };
    const access_token = await this.jwtService.signAsync(payload);

    await this.producerService.produce({
      topic: 'token',
      messages: [
        {
          value: JSON.stringify({
            token: access_token,
            name: userInfo.name,
            email: userInfo.email,
          }),
        },
      ],
    });

    // this.authClient.emit('token', access_token);
    return { access_token, user: userInfo };
  }
}
