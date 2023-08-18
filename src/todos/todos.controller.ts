import { CreateTodoDto } from './dtos/create-todo.dto';
import { TodosService } from './todos.service';
import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Param,
  Delete,
	UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() dto: CreateTodoDto) {
    return this.todosService.create(dto);
  }

	@UseGuards(LocalAuthGuard)
  @Get()
  getAll() {
    return this.todosService.getAll();
  }

  @Get(':id')
  getDetail(@Param('id') id: number) {
    return this.todosService.getDetail(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: CreateTodoDto) {
    return this.todosService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.todosService.delete(id);
  }
}
