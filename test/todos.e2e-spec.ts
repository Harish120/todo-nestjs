import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';

describe('Todo API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  describe('POST /todos (create)', () => {
    it('should create a todo and return it with 201', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .send({
          title: 'Learn E2E Testing',
          description: 'Test the full API flow',
          completed: false,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Learn E2E Testing');
          expect(res.body).toHaveProperty('createdAt');
        });
    });

    it('should return 400 when title is empty', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .send({ title: '' })
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.error).toBe('Bad Request');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('path');
        });
    });

    it('should return 400 when title is missing', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .send({ description: 'No title' })
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.error).toBe('Bad Request');
        });
    });
  });

  describe('GET /todos (findAll)', () => {
    it('should return empty array initially', () => {
      return request(app.getHttpServer())
        .get('/todos')
        .expect(200)
        .expect([]);
    });

    it('should return all created todos', async () => {
      await request(app.getHttpServer())
        .post('/todos')
        .send({ title: 'Todo 1' });

      await request(app.getHttpServer())
        .post('/todos')
        .send({ title: 'Todo 2' });

      return request(app.getHttpServer())
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(res.body[0].title).toBe('Todo 1');
          expect(res.body[1].title).toBe('Todo 2');
        });
    });
  });

  describe('GET /todos/:id (findOne)', () => {
    it('should return a todo by id', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/todos')
        .send({ title: 'Find Me' });

      const todoId = createRes.body.id;

      return request(app.getHttpServer())
        .get(`/todos/${todoId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(todoId);
          expect(res.body.title).toBe('Find Me');
        });
    });

    it('should return 404 with standardized error when todo not found', () => {
      return request(app.getHttpServer())
        .get('/todos/999')
        .expect(404)
        .expect((res) => {
          expect(res.body.statusCode).toBe(404);
          expect(res.body.message).toBe('Todo with id 999 not found');
          expect(res.body.error).toBe('TodoNotFound');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('path');
          expect(res.body.path).toBe('/todos/999');
        });
    });

    it('should return 400 for invalid id parameter', () => {
      return request(app.getHttpServer())
        .get('/todos/invalid')
        .expect(400)
        .expect((res) => {
          expect(res.body.statusCode).toBe(400);
          expect(res.body.error).toBe('Bad Request');
        });
    });
  });

  describe('PATCH /todos/:id (update)', () => {
    it('should update a todo', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/todos')
        .send({ title: 'Original', completed: false });

      const todoId = createRes.body.id;

      return request(app.getHttpServer())
        .patch(`/todos/${todoId}`)
        .send({ title: 'Updated', completed: true })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Updated');
          expect(res.body.completed).toBe(true);
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should return 404 when updating non-existent todo', () => {
      return request(app.getHttpServer())
        .patch('/todos/999')
        .send({ title: 'Update' })
        .expect(404)
        .expect((res) => {
          expect(res.body.error).toBe('TodoNotFound');
        });
    });
  });

  describe('DELETE /todos/:id (remove)', () => {
    it('should delete a todo and return 204', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/todos')
        .send({ title: 'To Delete' });

      const todoId = createRes.body.id;

      return request(app.getHttpServer())
        .delete(`/todos/${todoId}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent todo', () => {
      return request(app.getHttpServer())
        .delete('/todos/999')
        .expect(404)
        .expect((res) => {
          expect(res.body.error).toBe('TodoNotFound');
        });
    });

    it('should prevent access to deleted todo', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/todos')
        .send({ title: 'Delete Me' });

      const todoId = createRes.body.id;

      await request(app.getHttpServer())
        .delete(`/todos/${todoId}`)
        .expect(204);

      return request(app.getHttpServer())
        .get(`/todos/${todoId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.error).toBe('TodoNotFound');
        });
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
