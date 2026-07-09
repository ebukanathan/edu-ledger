import { Request, Response, NextFunction } from 'express';
import * as service from './auth.service';
import { parseLogin } from './auth.validation';
import { UnauthorizedError } from '../../shared/errors/app-error';

// HTTP layer: parse request, call service, shape response.
// No business logic here.

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.login(parseLogin(req.body));
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.principal) throw new UnauthorizedError();
    res.json(await service.getUserById(req.principal.userId));
  } catch (err) {
    next(err);
  }
}

export function logout(_req: Request, res: Response) {
  // Stateless JWT: nothing to invalidate server-side; the client drops the token.
  res.json({ success: true });
}
