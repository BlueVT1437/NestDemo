import { PassportModule } from '@nestjs/passport';
import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todos.entity';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { PermissionModule } from 'src/permissions/permission.module';
import { Permission } from 'src/permissions/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo, Permission]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'todos2222',
      session: false,
    }),
		PermissionModule
  ],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
