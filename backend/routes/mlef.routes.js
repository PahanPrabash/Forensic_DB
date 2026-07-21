import { Router } from 'express';
import { getMLEFs, getMLEFById, createMLEF, updateMLEF } from '../controllers/mlef.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/', getMLEFs);
router.get('/:id', getMLEFById);
router.post('/', createMLEF);
router.put('/:id', updateMLEF);

export default router;
