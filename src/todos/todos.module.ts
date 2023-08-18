import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todos.entity';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'todos',
      session: false,
    }),
  ],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
