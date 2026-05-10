import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { adminOnly } from '../middleware/admin.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, adminOnly);

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserById);
router.get('/analytics/trips', adminController.getTripAnalytics);
router.get('/analytics/expenses', adminController.getExpenseAnalytics);
router.get('/analytics/community', adminController.getCommunityAnalytics);

export default router;
