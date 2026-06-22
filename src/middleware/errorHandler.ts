import { Request, Response, NextFunction } from 'express';
import { ApiError, ErrorResponse } from '../types';

/**
 * Centralized error handler. Converts ApiError instances into a consistent
 * JSON error shape; falls back to 500 for anything unexpected.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    const response: ErrorResponse = {
      error: { message: err.message, code: err.code },
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Unexpected error - don't leak internals to the client.
  console.error(err);
  const response: ErrorResponse = {
    error: { message: 'Internal server error.', code: 'INTERNAL_ERROR' },
  };
  res.status(500).json(response);
}

/**
 * Catches requests to unknown routes and forwards a 404 ApiError.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new ApiError(404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found.`));
}
