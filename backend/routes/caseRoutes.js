import express from 'express';
import { getAllCases, createCase } from '../controllers/caseController.js';

const router = express.Router();

router.get('/', getAllCases);
router.post('/', createCase);

export default router;
