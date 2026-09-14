const express = require('express');
const router = express.Router();
const disruptionController = require('../controllers/disruptionController');

router.get('/active', disruptionController.getActiveDisruptions);
router.post('/report', disruptionController.reportDisruption);

module.exports = router;
