const Notification = require("../models/Notification");

const notificationService = {
  //Get all Notifications
  getUserNotifications: async (userId) => {
    return await Notification.find({ user: userId }).sort({ createdAt: -1 });
  },
  // Mark Notification As Read
  markAsRead: async (notificationId, userId) => {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    );
  },

  //Post Notifications dinamically
  postNotification: async (notification) => {
    return await Notification.create({
      user: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
    });
  },
};

module.exports = notificationService;
