const express = require("express");

const {
  createTransportService,
  getTransportServices,
  getTransportServiceById,
  updateTransportService,
  deleteTransportService,
} = require("../controllers/transportServiceController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Get all transportation services
router.get("/", getTransportServices);

// Get one transportation service
router.get("/:id", getTransportServiceById);

// Admin only - create service
router.post("/", protect, authorize("admin"), createTransportService);

// Admin only - update service
router.put("/:id", protect, authorize("admin"), updateTransportService);

// Admin only - delete service
router.delete("/:id", protect, authorize("admin"), deleteTransportService);

module.exports = router;