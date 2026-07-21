import { Router } from 'express';
import { getPatients, getPatientById, createPatientWithCase, getDoctors } from '../controllers/patient.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/', getPatients);
router.get('/:id', getPatientById);
router.post('/', createPatientWithCase);

export default router;
