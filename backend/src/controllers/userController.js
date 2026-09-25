const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        preferences: req.user.preferences,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

const updatePreference = async (req, res) => {
  try {
    const { preferences } = req.body;

    const allowedPreferences = [
      "fastest",
      "cheapest",
      "minimum_walking",
      "minimum_transfers",
      "most_reliable",
    ];

    if (!allowedPreferences.includes(preferences)) {
      return res.status(400).json({
        message: "Invalid journey preference",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Preference updated successfully",
      preferences: user.preferences,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update preference",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, preferences } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      password: password || "password123",
      role: role || "passenger",
      preferences: preferences || "fastest",
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userObj,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      message: "User removed successfully",
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updatePreference,
  getAllUsers,
  createUser,
  deleteUser,
  updateUserRole,
};