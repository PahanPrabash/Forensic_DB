import express from 'express';
import { getAllAutopsies, createAutopsy } from '../controllers/autopsyController.js';

const router = express.Router();

router.get('/', getAllAutopsies);
router.post('/', createAutopsy);

export default router;
