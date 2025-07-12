const Notification = require("../models/Notification");

const notificationService = {
  //Get all Notifications
  getNotifications: async (userId) => {
    return await Notification.find({ user: userId }).sort({ createdAt: -1 });
  },
  // Mark Notification As Read
  markAsRead: async (notificationId) => {
    return await Notification.findOneAndUpdate(
      { _id: notificationId },
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
