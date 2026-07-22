import express from 'express';
import { getAuditLogs, getNotifications } from '../controllers/auditController.js';
import { protect, checkModulePermission } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/audit-logs', checkModulePermission('UserAdmin', 'read'), getAuditLogs);
router.get('/notifications', checkModulePermission('UserAdmin', 'read'), getNotifications);

export default router;
