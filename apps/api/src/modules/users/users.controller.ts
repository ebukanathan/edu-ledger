import { Request, Response, NextFunction } from 'express';
import * as service from './users.service';

// HTTP layer: parse request, call service, shape response.
// No business logic here.
