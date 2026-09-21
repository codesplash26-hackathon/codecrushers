const Notification = require("../models/Notification");
const {
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITY,
} = require("../config/constants");

/**
 * Base create notification function
 */
const createNotification = async (notificationData) => {
  return await Notification.create(notificationData);
};

/**
 * Delay Notification
 */
const createDelayNotification = async (
  userId,
  journeyId,
  disruptionId,
  routeName,
  delayMinutes
) => {
  return await createNotification({
    user: userId,
    type: NOTIFICATION_TYPES.DELAY,
    title: `${routeName || "Transportation"} Delayed`,
    message: `${routeName || "Your service"} is delayed by approximately ${delayMinutes} minutes.`,
    relatedJourney: journeyId,
    relatedDisruption: disruptionId,
    priority: NOTIFICATION_PRIORITY.HIGH,
  });
};

/**
 * Connection Risk Notification
 */
const createConnectionRiskNotification = async (
  userId,
  journeyId,
  prevMode = "bus",
  nextMode = "train",
  riskLevel = "HIGH"
) => {
  return await createNotification({
    user: userId,
    type: NOTIFICATION_TYPES.CONNECTION_RISK,
    title: "Connection Risk Detected",
    message: `Your connection from ${prevMode} to ${nextMode} has a ${riskLevel.toLowerCase()} risk of being missed.`,
    relatedJourney: journeyId,
    priority: NOTIFICATION_PRIORITY.HIGH,
  });
};

/**
 * Journey Change Notification
 */
const createJourneyChangeNotification = async (
  userId,
  journeyId,
  reason = "transportation disruption"
) => {
  return await createNotification({
    user: userId,
    type: NOTIFICATION_TYPES.JOURNEY_CHANGE,
    title: "Journey Updated",
    message: `Your journey has been updated due to a ${reason}.`,
    relatedJourney: journeyId,
    priority: NOTIFICATION_PRIORITY.CRITICAL,
  });
};

/**
 * Alternative Route Notification
 */
const createAlternativeRouteNotification = async (
  userId,
  journeyId,
  alternativesCount = 1
) => {
  return await createNotification({
    user: userId,
    type: NOTIFICATION_TYPES.ALTERNATIVE_ROUTE,
    title: "Alternative Route Available",
    message: `Your current journey is affected. ${alternativesCount} alternative route(s) available.`,
    relatedJourney: journeyId,
    priority: NOTIFICATION_PRIORITY.HIGH,
  });
};

/**
 * Get notifications for user
 */
const getUserNotifications = async (userId, unreadOnly = false) => {
  const query = { user: userId };
  if (unreadOnly) {
    query.isRead = false;
  }
  return await Notification.find(query).sort({ createdAt: -1 });
};

/**
 * Mark a single notification as read
 */
const markAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { new: true }
  );
};

/**
 * Mark all notifications for user as read
 */
const markAllAsRead = async (userId) => {
  return await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true }
  );
};

module.exports = {
  createNotification,
  createDelayNotification,
  createConnectionRiskNotification,
  createJourneyChangeNotification,
  createAlternativeRouteNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
