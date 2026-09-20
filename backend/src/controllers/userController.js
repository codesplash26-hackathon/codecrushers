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

module.exports = {
  getProfile,
  updatePreference,
};