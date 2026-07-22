import express from 'express';
import { getCases, createCase } from '../controllers/caseController.js';
import { protect, checkModulePermission } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, checkModulePermission('Case', 'read'), getCases);
router.post('/', protect, checkModulePermission('Case', 'create'), createCase);

export default router;
