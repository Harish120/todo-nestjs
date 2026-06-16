import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { TodoNotFoundException } from './exceptions';
import { CreateTodoDto } from './dtos/create-todo.dto';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  describe('create', () => {
    it('should create a todo and return it with an id', () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
      };

      const result = service.create(createTodoDto);

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: 'Test Todo',
          description: 'Test Description',
          completed: false,
          createdAt: expect.any(Date),
        }),
      );
    });

    it('should increment id for each created todo', () => {
      const dto: CreateTodoDto = { title: 'Todo 1' };
      const todo1 = service.create(dto);
      const todo2 = service.create(dto);

      expect(todo2.id).toBe(todo1.id + 1);
    });
  });

  describe('findAll', () => {
    it('should return empty array when no todos exist', () => {
      const result = service.findAll();
      expect(result).toEqual([]);
    });

    it('should return all created todos', () => {
      service.create({ title: 'Todo 1' });
      service.create({ title: 'Todo 2' });

      const result = service.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Todo 1');
      expect(result[1].title).toBe('Todo 2');
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', () => {
      const created = service.create({ title: 'Find Me' });
      const result = service.findOne(created.id);

      expect(result).toEqual(created);
    });

    it('should throw TodoNotFoundException when todo does not exist', () => {
      expect(() => service.findOne(999)).toThrow(TodoNotFoundException);
    });
  });

  describe('update', () => {
    it('should update a todo', () => {
      const created = service.create({ title: 'Original', completed: false });
      const updated = service.update(created.id, {
        title: 'Updated',
        completed: true,
      });

      expect(updated.title).toBe('Updated');
      expect(updated.completed).toBe(true);
      expect(updated.updatedAt).toBeDefined();
    });

    it('should throw TodoNotFoundException when updating non-existent todo', () => {
      expect(() => service.update(999, { title: 'Update' })).toThrow(
        TodoNotFoundException,
      );
    });

    it('should preserve original fields not in update', () => {
      const created = service.create({
        title: 'Original',
        description: 'Keep this',
      });
      const updated = service.update(created.id, { title: 'New Title' });

      expect(updated.description).toBe('Keep this');
    });
  });

  describe('remove', () => {
    it('should remove a todo', () => {
      const created = service.create({ title: 'To Delete' });
      service.remove(created.id);

      expect(() => service.findOne(created.id)).toThrow(TodoNotFoundException);
    });

    it('should throw TodoNotFoundException when removing non-existent todo', () => {
      expect(() => service.remove(999)).toThrow(TodoNotFoundException);
    });

    it('should not affect other todos', () => {
      const todo1 = service.create({ title: 'Keep' });
      const todo2 = service.create({ title: 'Delete' });

      service.remove(todo2.id);

      expect(service.findOne(todo1.id)).toEqual(todo1);
      expect(() => service.findOne(todo2.id)).toThrow();
    });
  });
});
