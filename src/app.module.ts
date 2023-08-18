import { UserModule } from './users/user.module';
import {
  Module,
  NestModule,
  MiddlewareConsumer
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TodosModule } from './todos/todos.module';
import { Todo } from './todos/todos.entity';
import { User } from './auth/auth.entity';
import middeware1 from './middlewares/middeware1';
import { Role } from './roles/role.entity';
import { RoleModule } from './roles/role.module';
import { KafkaModule } from './kafka/kafka.module';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

config();

@Module({
  imports: [
    TodosModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '1234',
        database: 'student',
        entities: [Todo, User, Role],
        synchronize: true, // should use false
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    RoleModule,
		UserModule,
		KafkaModule,
		ClientsModule.register([
      {
        name: 'AUTH_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: ['localhost:9092'],
          },
          producerOnlyMode: true,
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(middeware1)
      // .exclude('todos')
      // .forRoutes({ method: RequestMethod.ALL, path: 'customer' });
      .forRoutes('*');
  }
}
