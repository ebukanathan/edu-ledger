import { Request, Response, NextFunction } from 'express';
import * as service from './users.service';
import { parseCreateSchoolUser } from './users.validation';
import { UnauthorizedError } from '../../shared/errors/app-error';

// HTTP layer: parse request, call service, shape response.
// No business logic here.

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.principal) throw new UnauthorizedError();
    const result = await service.createSchoolUser(req.principal, parseCreateSchoolUser(req.body));
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.principal) throw new UnauthorizedError();
    res.json(await service.listSchoolUsers(req.principal));
  } catch (err) {
    next(err);
  }
}
