import express from 'express';
import { getCases, createCase } from '../controllers/caseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getCases);
router.post('/', protect, createCase);

export default router;
