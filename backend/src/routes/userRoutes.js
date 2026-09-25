const express = require("express");

const {
  getProfile,
  updatePreference,
  getAllUsers,
  createUser,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// User management (admin/read)
router.get("/", getAllUsers);
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.put("/:id/role", updateUserRole);

// Profile & Preferences
router.get("/profile", protect, getProfile);
router.put("/preference", protect, updatePreference);

module.exports = router;