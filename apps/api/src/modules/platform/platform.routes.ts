import { Router } from 'express';
import * as controller from './platform.controller';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware';
import { Role } from '../../generated/prisma/client';

const router = Router();

router.post('/schools', authenticate, authorize(Role.PLATFORM_ADMIN), controller.onboardSchool);

export default router;
