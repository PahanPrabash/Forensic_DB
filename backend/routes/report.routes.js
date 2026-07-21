import { Router } from 'express';
import { getReports, getReportById, createReport, getTemplates } from '../controllers/report.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/templates', getTemplates);
router.get('/', getReports);
router.get('/:id', getReportById);
router.post('/', createReport);

export default router;
