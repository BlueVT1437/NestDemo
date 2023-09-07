import { Injectable, UseGuards, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todos.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dtos/create-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>, // @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(dto: CreateTodoDto) {
    const todo = await this.todoRepository.create(dto);
		await this.todoRepository.save(todo)
    return { message: 'Created successfully!' };
  }

  async getAll() {
    return await this.todoRepository.find();
  }

  async getDetail(id: number) {
    return await this.todoRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: CreateTodoDto) {
    const todo = await this.todoRepository.findOne({ where: { id } });

    Object.assign(todo, dto);
    await this.todoRepository.save(todo);
    return { message: 'Updated successfully!' };
  }

  async delete(id: number) {
    const todo = await this.todoRepository.findOne({ where: { id } });
    await this.todoRepository.remove(todo);

    return { message: 'Deleted successfully!' };
  }
}
