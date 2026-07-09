import { Router } from 'express';
import { authRoutes } from './modules/auth';
import { platformRoutes } from './modules/platform';
import { usersRoutes } from './modules/users';
import { paymentsRoutes } from './modules/payments';
import { reconciliationRoutes } from './modules/reconciliation';

const router = Router();

router.use('/auth', authRoutes);
router.use('/platform', platformRoutes);
router.use('/users', usersRoutes);
router.use('/payments', paymentsRoutes);
router.use('/reconciliation', reconciliationRoutes);

export default router;
