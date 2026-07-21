// ═══════════════════════════════════════════════════════════════════════════
// Referral & Review Routes — Combined API Routes
// ═══════════════════════════════════════════════════════════════════════════

import { Router } from 'express';
import {
  getAllReferrals, createReferral, updateReferral,
  getAllReviews, createReview, updateReview
} from '../controllers/referralController.js';

const router = Router();

// Referral endpoints
router.get('/', getAllReferrals);              // GET /api/referrals
router.post('/', createReferral);             // POST /api/referrals
router.put('/:id', updateReferral);           // PUT /api/referrals/:id

// Review appointment endpoints
router.get('/reviews', getAllReviews);         // GET /api/referrals/reviews
router.post('/reviews', createReview);        // POST /api/referrals/reviews
router.put('/reviews/:id', updateReview);     // PUT /api/referrals/reviews/:id

export default router;
