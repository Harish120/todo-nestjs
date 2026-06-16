import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * AuthGuard is responsible for validating requests.
 * It checks if the request has a valid authorization token.
 *
 * Flow:
 * 1. Extract token from Authorization header
 * 2. Validate token exists
 * 3. Validate token is correct
 * 4. Attach user to request
 * 5. Allow or deny access
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Get the HTTP request object
    const request = context.switchToHttp().getRequest<Request>();

    // Extract token from header
    const token = this.extractToken(request);

    // If no token, deny access
    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    // For this example, we check against a hardcoded valid token
    // In production, you'd validate against a database or JWT service
    if (!this.isValidToken(token)) {
      throw new UnauthorizedException('Invalid authorization token');
    }

    // If token is valid, attach user info to request
    // The controller can then use @CurrentUser() to access this
    request.user = {
      id: 1,
      username: 'john_doe',
      email: 'john@example.com',
    };

    // Return true to allow the request to proceed
    return true;
  }

  /**
   * Extract the token from the Authorization header.
   * Expected format: "Bearer <token>"
   * Returns the token, or undefined if not found or invalid format
   */
  private extractToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    // If no auth header, return undefined
    if (!authHeader) {
      return undefined;
    }

    // Split by space: ["Bearer", "<token>"]
    const parts = authHeader.split(' ');

    // Validate format: must be "Bearer <token>" (2 parts)
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return undefined;
    }

    // Return the token part
    return parts[1];
  }

  /**
   * Validate if the token is legitimate.
   * In production, this would:
   * - Verify JWT signature
   * - Check token expiration
   * - Look up user in database
   * - Check token blacklist
   *
   * For now, we just check against a hardcoded token.
   */
  private isValidToken(token: string): boolean {
    const validToken = 'valid-token-123';
    return token === validToken;
  }
}