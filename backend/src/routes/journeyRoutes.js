const express = require('express');
const router = express.Router();
const journeyController = require('../controllers/journeyController');

router.post('/plan', journeyController.planJourney);
router.post('/reoptimize', journeyController.reoptimizeJourney);

module.exports = router;
