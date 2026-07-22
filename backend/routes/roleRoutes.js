import express from 'express';
import { getAllRoles, getRolePermissions, updateRolePermission } from '../controllers/roleController.js';
import { protect, checkModulePermission } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', checkModulePermission('UserAdmin', 'read'), getAllRoles);
router.get('/:roleId/permissions', checkModulePermission('UserAdmin', 'read'), getRolePermissions);
router.put('/:roleId/permissions', checkModulePermission('UserAdmin', 'update'), updateRolePermission);

export default router;
