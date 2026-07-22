import express from 'express';
import { getAllStaff, createStaff, getAllDoctors, createDoctor, updateStaffStatus, deleteStaff } from '../controllers/staffController.js';
import { protect, checkModulePermission } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', checkModulePermission('Staff', 'read'), getAllStaff);
router.post('/', checkModulePermission('Staff', 'create'), createStaff);
router.put('/:id/status', checkModulePermission('Staff', 'update'), updateStaffStatus);
router.delete('/:id', checkModulePermission('Staff', 'delete'), deleteStaff);

router.get('/doctors', getAllDoctors);
router.post('/doctors', checkModulePermission('Staff', 'create'), createDoctor);

export default router;
