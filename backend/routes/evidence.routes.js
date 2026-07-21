import { Router } from 'express';
import { getEvidence, createEvidence, transferCustody, getLabTests, createLabTest, updateLabTest, getStaff } from '../controllers/evidence.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

// Evidence
router.get('/', getEvidence);
router.get('/staff', getStaff);
router.post('/', createEvidence);
router.post('/:id/transfer', transferCustody);

export default router;
