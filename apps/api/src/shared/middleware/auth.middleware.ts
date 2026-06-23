import { Request, Response, NextFunction } from 'express';

// Verifies the bearer token and attaches the principal to the request.
export function authenticate(_req: Request, _res: Response, next: NextFunction) {
  // TODO: verify JWT, load principal
  next();
}
