import { Router } from 'express';
import { getCases, getCaseById, updateCase } from '../controllers/case.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/', getCases);
router.get('/:id', getCaseById);
router.put('/:id', updateCase);

export default router;
