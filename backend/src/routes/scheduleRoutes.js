const express = require("express");

const {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Get all schedules
router.get("/", getSchedules);

// Get one schedule
router.get("/:id", getScheduleById);

// Admin only - create schedule
router.post("/", protect, authorize("admin"), createSchedule);

// Admin only - update schedule
router.put("/:id", protect, authorize("admin"), updateSchedule);

// Admin only - delete schedule
router.delete("/:id", protect, authorize("admin"), deleteSchedule);

module.exports = router;