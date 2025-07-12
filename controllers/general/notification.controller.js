const { default: mongoose } = require("mongoose");
const {
  getNotifications,
  markAsRead,
} = require("../../services/notification.service");
const response = require("../../utils/response.util");

const userNotificationController = {
  //GET ALL NOTIFICATION
  getAllNotifications: async (req, res, next) => {
    try {
      const notifications = await getNotifications(req.user._id);

      // If no notifications
      if (!notifications || notifications.length === 0) {
        return response(
          res,
          "notifications",
          [],
          200,
          true,
          "No notifications found"
        );
      }

      response(res, "notifications", notifications);
    } catch (error) {
      next(error);
    }
  },
  // MARK NOTIFICATION AS READ
  markNotificationAsRead: async (req, res, next) => {
    try {
      const notificationId = req.params.id;

      //check if the notificationId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        return res.status(400).json({ message: "Invalid notification ID" });
      }

      const notification = await markAsRead(notificationId);

      if (!notification) {
        res.status(404);
        throw new Error("Notification not found");
      }

      response(
        res,
        "notification",
        notification,
        200,
        true,
        "Notification marked as read"
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userNotificationController;
