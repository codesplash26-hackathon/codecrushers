const User = require('../models/User');
const Preference = require('../models/Preference');

exports.getUserProfile = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

exports.updatePreferences = async (req, res, next) => {
  try {
    res.status(200).json({ message: 'Preferences updated successfully' });
  } catch (err) {
    next(err);
  }
};
