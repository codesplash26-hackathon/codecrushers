const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
} = require("../services/notificationService");
const Notification = require("../models/Notification");
const User = require("../models/User");
const {
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITY,
} = require("../config/constants");

const defaultSeedNotifications = [
  {
    type: NOTIFICATION_TYPES.DELAY,
    title: "Kandy Express Delayed",
    message: "Signal failure at Peradeniya causing 20-min delay.",
    priority: NOTIFICATION_PRIORITY.HIGH,
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    type: NOTIFICATION_TYPES.JOURNEY_CHANGE,
    title: "Route 654 Diverted",
    message: "Road maintenance along Kandy Rd. Buses rerouted.",
    priority: NOTIFICATION_PRIORITY.HIGH,
    isRead: false,
    createdAt: new Date(Date.now() - 8 * 60 * 1000),
  },
  {
    type: NOTIFICATION_TYPES.DELAY,
    title: "Intercity 55 Cancelled",
    message: "Colombo Fort service cancelled due to locomotive maintenance.",
    priority: NOTIFICATION_PRIORITY.CRITICAL,
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    type: NOTIFICATION_TYPES.DELAY,
    title: "Route 120 Slow Traffic",
    message: "Traffic congestion at Nugegoda junction causing 10-min delay.",
    priority: NOTIFICATION_PRIORITY.NORMAL,
    isRead: false,
    createdAt: new Date(Date.now() - 22 * 60 * 1000),
  },
  {
    type: NOTIFICATION_TYPES.DELAY,
    title: "Coastal Express Delay",
    message: "Panadura level-crossing delay of 25 minutes reported.",
    priority: NOTIFICATION_PRIORITY.HIGH,
    isRead: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    type: NOTIFICATION_TYPES.ALTERNATIVE_ROUTE,
    title: "Galle Shuttle Rerouted",
    message: "Temporary detour active around Hikkaduwa station.",
    priority: NOTIFICATION_PRIORITY.NORMAL,
    isRead: true,
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    type: NOTIFICATION_TYPES.DELAY,
    title: "Matale Local Delay",
    message: "Platform clearance delay of 12 mins at Katugastota.",
    priority: NOTIFICATION_PRIORITY.NORMAL,
    isRead: true,
    createdAt: new Date(Date.now() - 90 * 60 * 1000),
  },
];

/**
 * Get all notifications for current user
 * GET /api/notifications
 */
const getNotifications = async (req, res, next) => {
  try {
    const isAdmin = req.user && (req.user.role === "admin" || req.user.role === "super_admin");

    if (isAdmin) {
      const count = await Notification.countDocuments();
      if (count === 0) {
        try {
          const docs = defaultSeedNotifications.map((n) => ({
            ...n,
            user: req.user._id,
          }));
          await Notification.insertMany(docs);
        } catch (e) {
          // ignore duplicate
        }
      }

      const notifications = await Notification.find({})
        .sort({ createdAt: -1 })
        .populate("relatedDisruption", "title severity routeName status");

      return res.status(200).json({
        success: true,
        count: notifications.length,
        data: notifications,
      });
    }

    const notifications = await getUserNotifications(req.user._id, false);
    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

/**
 * Get unread notifications for current user
 * GET /api/notifications/unread
 */
const getUnreadNotifications = async (req, res, next) => {
  try {
    const isAdmin = req.user && (req.user.role === "admin" || req.user.role === "super_admin");
    let notifications = [];

    if (isAdmin) {
      notifications = await Notification.find({ isRead: false }).sort({ createdAt: -1 });
    } else {
      notifications = await getUserNotifications(req.user._id, true);
    }

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch unread notifications",
      error: error.message,
    });
  }
};

/**
 * Mark notification as read
 * PATCH /api/notifications/:id/read
 */
const markNotificationAsRead = async (req, res, next) => {
  try {
    const isAdmin = req.user && (req.user.role === "admin" || req.user.role === "super_admin");
    const filter = isAdmin ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };

    const notification = await Notification.findOneAndUpdate(
      filter,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update notification",
      error: error.message,
    });
  }
};

/**
 * Mark all notifications as read
 * PATCH /api/notifications/read-all
 */
const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const isAdmin = req.user && (req.user.role === "admin" || req.user.role === "super_admin");
    const filter = isAdmin ? { isRead: false } : { user: req.user._id, isRead: false };

    await Notification.updateMany(filter, { isRead: true });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
      error: error.message,
    });
  }
};

/**
 * Delete a notification
 * DELETE /api/notifications/:id
 */
const deleteNotification = async (req, res, next) => {
  try {
    const isAdmin = req.user && (req.user.role === "admin" || req.user.role === "super_admin");
    const filter = isAdmin ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };

    const notification = await Notification.findOneAndDelete(filter);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};
