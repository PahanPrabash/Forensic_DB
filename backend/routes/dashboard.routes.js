import { Router } from 'express';
import { getStats, getRecentCases, getNotifications } from '../controllers/dashboard.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/stats', getStats);
router.get('/recent-cases', getRecentCases);
router.get('/notifications', getNotifications);

export default router;
