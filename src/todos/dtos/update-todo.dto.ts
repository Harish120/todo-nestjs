import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * UpdateTodoDto
 *
 * Allows partial updates of a Todo.
 * Using optional fields is similar to Laravel's sometimes validation.
 */
export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
