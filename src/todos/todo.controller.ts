import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { Todo } from './entities/todo.entity';

/**
 * TodoController
 *
 * Guard Strategy:
 * - GET routes (findAll, findOne): PUBLIC - no guard needed
 * - POST route (create): PROTECTED - requires valid token
 * - PATCH route (update): PROTECTED - requires valid token
 * - DELETE route (remove): PROTECTED - requires valid token
 *
 * Why?
 * Users can read todos without authentication.
 * Only authenticated users can create, update, or delete todos.
 */

/**
 * TodoController
 *
 * Handles HTTP requests for the Todo feature.
 * This is the entry point for the API layer.
 */
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(): Todo[] {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Todo {
    return this.todoService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createTodoDto: CreateTodoDto,
    @CurrentUser() user: any,
  ): Todo {
    // Guard ensures user is authenticated
    // @CurrentUser() gives us the user object from request
    console.log(`User ${user.username} creating todo`);
    return this.todoService.create(createTodoDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @CurrentUser() user: any,
  ): Todo {
    console.log(`User ${user.username} updating todo ${id}`);
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any): void {
    console.log(`User ${user.username} deleting todo ${id}`);
    return this.todoService.remove(id);
  }
}
