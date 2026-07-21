const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courtController');

router.post('/court-summons', courtController.createCourtSummons);
router.get('/court-summons', courtController.getCourtSummons);

module.exports = router;
