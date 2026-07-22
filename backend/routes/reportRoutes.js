import express from 'express';
import { getAllReports } from '../controllers/reportController.js';

const router = express.Router();

router.get('/', getAllReports);

export default router;
