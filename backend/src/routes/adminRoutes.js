const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/adminController");

// Public/Admin Overview route for Dashboard
router.get("/dashboard-stats", getDashboardStats);

module.exports = router;
