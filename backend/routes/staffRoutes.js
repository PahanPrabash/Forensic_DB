import express from 'express';
import { getAllStaff, createStaff, getAllDoctors, createDoctor } from '../controllers/staffController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllStaff);
router.post('/', authorize('System Administrator'), createStaff);

router.get('/doctors', getAllDoctors);
router.post('/doctors', authorize('System Administrator'), createDoctor);

export default router;
