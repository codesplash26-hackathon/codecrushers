const Analytics = require('../models/Analytics');

exports.getDashboardStats = async (req, res, next) => {
  try {
    res.status(200).json({
      totalUsers: 150,
      activeRoutes: 42,
      activeDisruptions: 3,
      totalJourneysPlanned: 1240
    });
  } catch (err) {
    next(err);
  }
};
