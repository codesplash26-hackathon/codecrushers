const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getSettings,
  updateSettings,
  resetSettings,
  reseedDatabase,
} = require("../controllers/adminController");

// Public/Admin Overview route for Dashboard
router.get("/dashboard-stats", getDashboardStats);

// System Settings routes
router.get("/settings", getSettings);
router.put("/settings", updateSettings);
router.post("/settings/reset", resetSettings);
router.post("/settings/reseed", reseedDatabase);

module.exports = router;
