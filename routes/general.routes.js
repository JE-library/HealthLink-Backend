const { Router } = require("express");
const router = Router();
const { login } = require("../controllers/general/login.controller.js");
const {
  getPosts,
  getSinglePost,
} = require("../controllers/general/posts.controller.js");

// Notification Controllers
const {
  markNotificationAsRead,
  getAllNotifications,
} = require("../controllers/general/notification.controller.js");

// Auth Middleware
const protected = require("../middlewares/auth.middleware.js");
const {
  getProviders,
  getSingleProvider,
} = require("../controllers/general/provider.controller.js");

//LOGIN ROUTE
router.post("/login", login);

//  NOTIFICATION ROUTES
// Get all notifications Route
// Mark notification As Read Route
router.get("/notifications", protected, getAllNotifications);
router.patch("/notifications/:id", protected, markNotificationAsRead);
module.exports = router;

// POST ROUTES
// Get all posts Route
// Get single post Route
router.get("/posts", getPosts);
router.get("/posts/:id", getSinglePost);

// SERVICE PROVIDERS ROUTES
// Get all posts Route
// Get single post Route
router.get("/providers", protected, getProviders);
router.get("/providers/:id", protected, getSingleProvider);
