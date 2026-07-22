import { Router } from 'express';
import { getAutopsies, getAutopsyById, createAutopsy, updateAutopsy, upsertCauseOfDeath } from '../controllers/autopsy.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/', getAutopsies);
router.get('/:id', getAutopsyById);
router.post('/', createAutopsy);
router.put('/:id', updateAutopsy);
router.post('/:id/cause-of-death', upsertCauseOfDeath);

export default router;
