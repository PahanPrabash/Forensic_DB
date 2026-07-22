import express from 'express';
import { getAllReports, createReport, getTemplates, updateTemplate } from '../controllers/reportController.js';
import { protect, checkModulePermission } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', checkModulePermission('Court', 'read'), getAllReports);
router.post('/', checkModulePermission('Court', 'create'), createReport);

router.get('/templates', checkModulePermission('Court', 'read'), getTemplates);
router.put('/templates/:id', checkModulePermission('Court', 'update'), updateTemplate);

export default router;
