const express = require("express");

const {
  searchJourneyController,
  createActiveJourneyController,
  rerouteJourneyController,
} = require("../controllers/journeyController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/search", protect, searchJourneyController);
router.post("/active", protect, createActiveJourneyController);
router.post("/:id/reroute", protect, rerouteJourneyController);

module.exports = router;