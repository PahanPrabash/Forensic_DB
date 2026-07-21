// ═══════════════════════════════════════════════════════════════════════════
// MLEF Routes — Medico-Legal Examination Form API Routes
// ═══════════════════════════════════════════════════════════════════════════

import { Router } from 'express';
import { getAllMLEFs, getMLEFById, createMLEF, updateMLEF } from '../controllers/mlefController.js';

const router = Router();

router.get('/', getAllMLEFs);          // GET /api/mlef
router.get('/:id', getMLEFById);      // GET /api/mlef/:id
router.post('/', createMLEF);         // POST /api/mlef
router.put('/:id', updateMLEF);       // PUT /api/mlef/:id

export default router;
