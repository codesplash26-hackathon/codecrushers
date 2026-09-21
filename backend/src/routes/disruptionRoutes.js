const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createDisruption,
  getDisruptions,
  getActiveDisruptions,
  getDisruptionById,
  updateDisruption,
  resolveDisruption,
  deleteDisruption,
} = require("../controllers/disruptionController");

// Public/Passenger read routes
router.get("/", getDisruptions);
router.get("/active", getActiveDisruptions);
router.get("/:id", getDisruptionById);

// Admin protected routes
router.post("/", protect, authorize("admin"), createDisruption);
router.put("/:id", protect, authorize("admin"), updateDisruption);
router.patch("/:id/resolve", protect, authorize("admin"), resolveDisruption);
router.delete("/:id", protect, authorize("admin"), deleteDisruption);

module.exports = router;
