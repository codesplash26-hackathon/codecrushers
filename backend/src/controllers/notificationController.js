const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id });
    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};
