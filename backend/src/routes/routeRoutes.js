const express = require("express");

const {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
} = require("../controllers/routeController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Get all routes
router.get("/", getRoutes);

// Get one route
router.get("/:id", getRouteById);

// Admin only - create route
router.post("/", protect, authorize("admin"), createRoute);

// Admin only - update route
router.put("/:id", protect, authorize("admin"), updateRoute);

// Admin only - delete route
router.delete("/:id", protect, authorize("admin"), deleteRoute);

module.exports = router;