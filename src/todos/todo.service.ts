import { Injectable } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { TodoNotFoundException } from './exceptions';

@Injectable()
export class TodoService {
  private todos: Todo[] = [];
  private nextId = 1;

  findAll(): Todo[] {
    return [...this.todos];
  }

  findOne(id: number): Todo {
    const todo = this.todos.find((item) => item.id === id);
    if (!todo) {
      throw new TodoNotFoundException(id);
    }
    return todo;
  }

  create(createTodoDto: CreateTodoDto): Todo {
    const todo: Todo = {
      id: this.nextId++,
      title: createTodoDto.title,
      description: createTodoDto.description,
      completed: createTodoDto.completed ?? false,
      createdAt: new Date(),
      updatedAt: undefined,
    };

    this.todos.push(todo);
    return todo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto): Todo {
    const todo = this.findOne(id);

    const updatedTodo: Todo = {
      ...todo,
      ...updateTodoDto,
      updatedAt: new Date(),
    };

    this.todos = this.todos.map((item) => (item.id === id ? updatedTodo : item));
    return updatedTodo;
  }

  remove(id: number): void {
    this.findOne(id);
    this.todos = this.todos.filter((item) => item.id !== id);
  }
}
