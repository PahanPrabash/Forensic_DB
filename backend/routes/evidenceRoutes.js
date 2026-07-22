import express from 'express';
import { getAllEvidence, createEvidence } from '../controllers/evidenceController.js';

const router = express.Router();

router.get('/', getAllEvidence);
router.post('/', createEvidence);

export default router;
