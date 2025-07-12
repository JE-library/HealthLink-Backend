const { Router } = require("express");
const router = Router();
// Notification Controllers
const {
  markNotificationAsRead,
  getAllNotifications,
} = require("../controllers/general/notification.controller.js");

// Auth Middleware
const protected = require("../middlewares/auth.middleware.js");

//  NOTIFICATION ROUTES
// Get all notifications Route
// Mark notification As Read Route
router.get("/notifications", protected, getAllNotifications);
router.patch("/notifications/:id", protected, markNotificationAsRead);
module.exports = router;
