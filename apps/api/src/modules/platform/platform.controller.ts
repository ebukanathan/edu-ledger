import { Request, Response, NextFunction } from 'express';
import * as service from './platform.service';
import { parseOnboardSchool } from './platform.validation';

// HTTP layer: parse request, call service, shape response.
// No business logic here.

export async function onboardSchool(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.onboardSchool(parseOnboardSchool(req.body));
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
