import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidTodoException extends HttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message,
        error: 'InvalidTodo',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
