import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { logger } from '../utils/logger';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  logger.error(err);
  return res.status(500).json({ message: 'Internal server error' });
}
