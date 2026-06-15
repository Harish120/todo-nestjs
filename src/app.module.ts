import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todos/todo.module';

/**
 * AppModule
 * 
 * Root application module that wires all feature modules together.
 * 
 * Similar to Laravel: This is like AppServiceProvider + main app bootstrap.
 * 
 * The `imports` array tells NestJS which feature modules to load.
 */
@Module({
  imports: [TodoModule],  // Load the Todo feature module
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
