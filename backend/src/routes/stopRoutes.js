const express = require("express");

const {
  createStop,
  getStops,
  getStopById,
  updateStop,
  deleteStop,
} = require("../controllers/stopController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Get all stops
router.get("/", getStops);

// Get one stop
router.get("/:id", getStopById);

// Admin only - create stop
router.post("/", protect, authorize("admin"), createStop);

// Admin only - update stop
router.put("/:id", protect, authorize("admin"), updateStop);

// Admin only - delete stop
router.delete("/:id", protect, authorize("admin"), deleteStop);

module.exports = router;