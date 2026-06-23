import { Router } from 'express';
import { authRoutes } from './modules/auth';
import { usersRoutes } from './modules/users';
import { paymentsRoutes } from './modules/payments';
import { reconciliationRoutes } from './modules/reconciliation';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/payments', paymentsRoutes);
router.use('/reconciliation', reconciliationRoutes);

export default router;
