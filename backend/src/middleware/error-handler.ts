import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../lib/errors';
import { error as errorResponse } from '../lib/api-response';
import { logError } from '../lib/logger';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return errorResponse(res, err.statusCode, err.code, err.message, err.details);
  }

  if (err instanceof ZodError) {
    return errorResponse(res, 400, 'VALIDATION_ERROR', 'Invalid input', err.flatten().fieldErrors);
  }

  logError(err);

  const message =
    err instanceof Error &&
    (err.message.includes("Can't reach database") ||
      err.message.includes('ECONNREFUSED') ||
      err.message.includes('Connection refused'))
      ? 'Database unavailable. Start Docker (docker compose up -d) or check DATABASE_URL.'
      : 'An unexpected error occurred';

  return errorResponse(res, 500, 'INTERNAL_ERROR', message);
}

export function notFoundHandler(_req: Request, res: Response) {
  return errorResponse(res, 404, 'NOT_FOUND', 'Endpoint not found');
}
