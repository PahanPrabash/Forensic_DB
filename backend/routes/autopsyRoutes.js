const express = require('express');
const router = express.Router();
const autopsyController = require('../controllers/autopsyController');

router.post('/postmortem', autopsyController.createPostmortem);
router.get('/postmortem', autopsyController.getPostmortems);
router.post('/cause-of-death', autopsyController.createCauseOfDeath);
router.get('/cause-of-death', autopsyController.getCauseOfDeaths);

module.exports = router;
