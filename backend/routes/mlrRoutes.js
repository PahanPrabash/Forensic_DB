// ═══════════════════════════════════════════════════════════════════════════
// MLR Routes — Medico-Legal Report API Routes
// ═══════════════════════════════════════════════════════════════════════════

import { Router } from 'express';
import { getAllMLRs, getMLRById, createMLR, updateMLR, issueMLR } from '../controllers/mlrController.js';

const router = Router();

router.get('/', getAllMLRs);           // GET /api/mlr
router.get('/:id', getMLRById);       // GET /api/mlr/:id
router.post('/', createMLR);          // POST /api/mlr
router.put('/issue/:id', issueMLR);   // PUT /api/mlr/issue/:id  (finalize)
router.put('/:id', updateMLR);        // PUT /api/mlr/:id

export default router;
