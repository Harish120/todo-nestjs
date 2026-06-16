/**
 * Extend Express Request type to include custom user property.
 *
 * In Laravel, $request->user() is built-in.
 * In Express/NestJS, we need to add it ourselves.
 *
 * This file tells TypeScript: "Our Request objects will have a user property."
 * The AuthGuard will set request.user, and TypeScript won't complain.
 */

declare namespace Express {
  interface Request {
    user?: {
      id: number;
      username: string;
      email: string;
    };
  }
}