import { Router } from 'express';
import * as controller from './auth.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';

const router = Router();

router.post('/login', controller.login);
router.get('/me', authenticate, controller.me);
router.post('/logout', authenticate, controller.logout);

export default router;
