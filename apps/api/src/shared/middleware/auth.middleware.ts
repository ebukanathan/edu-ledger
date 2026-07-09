import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { ForbiddenError, UnauthorizedError } from '../errors/app-error';
import type { Role } from '../../generated/prisma/client';

// Verifies the bearer token and attaches the principal to the request.
// Routes that need a logged-in caller mount this before their handler.
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing bearer token');
    }

    const token = header.slice('Bearer '.length).trim();
    const payload = verifyToken(token);

    req.principal = {
      userId: payload.sub,
      schoolId: payload.schoolId ?? null,
      role: payload.role as Role,
    };
    next();
  } catch (err) {
    next(err);
  }
}

// Restricts a route to callers whose role is in the allowed set. Mount after
// `authenticate` so `req.principal` is populated.
export function authorize(...roles: Role[]) {
  return function (req: Request, _res: Response, next: NextFunction) {
    if (!req.principal) return next(new UnauthorizedError());
    if (!roles.includes(req.principal.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }
    next();
  };
}
