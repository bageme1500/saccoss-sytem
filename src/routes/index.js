import express from 'express';
import userRoutes from './userRoutes.js';
import roleRoutes from './roleRoutes.js';
import membershipRoutes from './membershipRoutes.js';
import contributionRoutes from './contributionRoutes.js';
import paymentRoutes from './paymentRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/memberships', membershipRoutes);
router.use('/monthly_contributions', contributionRoutes);
router.use('/payments', paymentRoutes);

export default router;

