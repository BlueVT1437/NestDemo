import { Roles } from 'src/roles/roles.decorator';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { TodosService } from './todos.service';
import { Permissions } from 'src/permissions/permisstion.decorator';
import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';

@UseGuards(LocalAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(RolesGuard)
  @Roles('User')
  @Permissions('ABLE_TO_GET_TODO')
  @Post()
  create(@Body() dto: CreateTodoDto) {
    return this.todosService.create(dto);
  }

  @Permissions('ABLE_TO_GET_TODO')
  @Get()
  getAll() {
    return this.todosService.getAll();
  }

  @Permissions('ABLE_TO_GET_TODO')
  @Get(':id')
  getDetail(@Param('id') id: number) {
    return this.todosService.getDetail(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: CreateTodoDto) {
    return this.todosService.update(id, dto);
  }

  @Roles('Admin')
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.todosService.delete(id);
  }
}
