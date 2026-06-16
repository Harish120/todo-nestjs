import { HttpException, HttpStatus } from '@nestjs/common';

export class TodoNotFoundException extends HttpException {
  constructor(id: number) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Todo with id ${id} not found`,
        error: 'TodoNotFound',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
