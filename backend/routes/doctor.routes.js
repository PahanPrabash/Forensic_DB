import { Router } from 'express';
import { getDoctors } from '../controllers/patient.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);
router.get('/', getDoctors);

export default router;
