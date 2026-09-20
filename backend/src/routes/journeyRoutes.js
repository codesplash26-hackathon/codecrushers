const express = require("express");

const {
  searchJourneyController,
} = require("../controllers/journeyController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Search for journeys
router.post("/search", protect, searchJourneyController);

module.exports = router;