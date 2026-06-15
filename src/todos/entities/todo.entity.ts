/**
 * Todo Entity
 * 
 * This defines the structure of a Todo item.
 * In NestJS, we use interfaces or classes for type safety.
 * 
 * Similar to Laravel: This is like defining attributes on an Eloquent model,
 * but as a TypeScript interface for compile-time type checking.
 */
export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
