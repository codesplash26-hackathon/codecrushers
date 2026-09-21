const express = require("express");

const {
  getProfile,
  updatePreference,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", protect, getProfile);

router.put("/preference", protect, updatePreference);

module.exports = router;