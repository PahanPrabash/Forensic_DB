import express from 'express';
import { getAllRoles, getRolePermissions, updateRolePermission } from '../controllers/roleController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllRoles);
router.get('/:roleId/permissions', getRolePermissions);
router.put('/:roleId/permissions', authorize('System Administrator'), updateRolePermission);

export default router;
