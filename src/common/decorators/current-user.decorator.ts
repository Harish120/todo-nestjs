import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * @CurrentUser() decorator
 *
 * Usage:
 *   @Patch(':id')
 *   @UseGuards(AuthGuard)
 *   update(@CurrentUser() user: any) {
 *     // user is the object set by AuthGuard
 *   }
 *
 * How it works:
 * 1. NestJS calls createParamDecorator when it sees @CurrentUser()
 * 2. The callback function runs
 * 3. We get the HTTP context and extract the Request object
 * 4. We return request.user (which AuthGuard set)
 * 5. That value is passed as the parameter to the controller method
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // Get the HTTP context from ExecutionContext
    const request = ctx.switchToHttp().getRequest<Request>();

    // Return the user object that AuthGuard attached to the request
    return request.user;
  },
);
