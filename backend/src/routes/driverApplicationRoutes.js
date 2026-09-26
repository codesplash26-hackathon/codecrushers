const express = require("express");
const router = express.Router();
const {
  createApplication,
  getApplications,
  getMyApplicationStatus,
  updateApplicationStatus,
  toggleDriverOnline,
} = require("../controllers/driverApplicationController");

// Public / Mobile commuter endpoints
router.post("/", createApplication);
router.get("/my-status", getMyApplicationStatus);
router.put("/toggle-online", toggleDriverOnline);

// Admin console endpoints
router.get("/", getApplications);
router.put("/:id/status", updateApplicationStatus);
router.patch("/:id/status", updateApplicationStatus);

module.exports = router;
