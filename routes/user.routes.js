const { Router } = require("express");
const router = Router();

// Auth Controllers
const {
  registerUser,
  loginUser,
  // logoutUser,
} = require("../controllers/user/userAuth.controller.js");
// Profile Controllers
const {
  getUser,
  updateUser,
  changePassword,
} = require("../controllers/user/userProfile.controller.js");
// Appointment Controllers
const {
  bookAppointment,
  getAppointmentsUser,
  getAppointmentById,
  cancelAppointment,
} = require("../controllers/user/userAppointment.controller.js");
// Lab Controllers
const {
  bookLabService,
  getLabRequestsUser,
  getLabRequestById,
  cancelLabRequest,
} = require("../controllers/user/userLabRequest.controller.js");
// Notification Controllers
const {
  getNotifications,
  markNotificationAsRead,
} = require("../controllers/user/userNotification.controller.js");
// Post Controllers
const { getPostsUser } = require("../controllers/user/userPost.controller.js");

// Auth Middleware
const protected = require("../middlewares/auth.middleware.js");
const upload = require("../middlewares/upload.middleware.js");

// Routes

// USER AUTH ROUTES
// Register route
// Login route
// Logout route
router.post("/register", upload.single("profilePhoto"), registerUser);
router.post("/login", loginUser);
// router.post("/logout", logoutUser);

// PROTECTED ROUTES ////////////

// USER PROFILE ROUTES
// Get Userprofile Route
// Update Userprofile Route
// Change UserPassword Route
router.get("/profile", protected, getUser);
router.put("/profile", protected, upload.single("profilePhoto"), updateUser);
router.put("/password", protected, changePassword);

// USER APPOINTMENT ROUTES
// Book Appointment Route
// Get all Appointments Route
// Get single Appointment Route
// Cancel Appointment Route
router.post("/book-appointment", protected, bookAppointment);
router.get("/appointments", protected, getAppointmentsUser);
router.get("/appointments/:id", protected, getAppointmentById);
router.delete("/appointments/:id", protected, cancelAppointment);

// USER LAB-REQUEST ROUTES
// Book lab requests Route
// Get all lab requests Route
// Get single lab request Route
// Cancel lab request Route
router.post("/book-lab-service", protected, bookLabService);
router.get("/lab-service", protected, getLabRequestsUser);
router.get("/lab-service/:id", protected, getLabRequestById);
router.delete("/lab-service/:id", protected, cancelLabRequest);

// USER NOTIFICATION ROUTES
// Get all notifications Route
// Mark notification As Read Route
router.get("/notifications", protected, getNotifications);
router.patch("/notifications/:id", protected, markNotificationAsRead);

// USER POST ROUTES
// Get all posts Route
router.get("/posts", protected, getPostsUser);

module.exports = router;
