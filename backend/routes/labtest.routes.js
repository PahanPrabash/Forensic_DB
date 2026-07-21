import { Router } from 'express';
import { getLabTests, createLabTest, updateLabTest } from '../controllers/evidence.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/', getLabTests);
router.post('/', createLabTest);
router.put('/:id', updateLabTest);

export default router;
