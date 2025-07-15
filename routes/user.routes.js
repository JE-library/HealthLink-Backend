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
  getAppointmentByIdUser,
  cancelAppointmentUser,
} = require("../controllers/user/userAppointment.controller.js");
// Lab Controllers
const {
  bookLabService,
  getLabRequestsUser,
  getLabRequestByIdUser,
  cancelLabRequestUser,
} = require("../controllers/user/userLabRequest.controller.js");
// Post Controllers
const { getPostsUser } = require("../controllers/user/userPost.controller.js");
// Overview Controllers
const {
  getOverviewUser,
} = require("../controllers/user/userOverview.controller.js");

// File Upload Middileware
const { handleProfilePic } = require("../middlewares/upload.middleware.js");

// Auth Middleware
const protected = require("../middlewares/auth.middleware.js");
const { isUser } = require("../middlewares/role.middleware.js");

// Routes

// USER AUTH ROUTES
// Register route
// Login route
// Logout route
router.post("/register", handleProfilePic, registerUser);
router.post("/login", loginUser);
// router.post("/logout", logoutUser);

// PROTECTED ROUTES ////////////

// USER PROFILE ROUTES
// Get Userprofile Route
// Update Userprofile Route
// Change UserPassword Route
router.get("/profile", protected, isUser, getUser);
router.put("/profile", protected, isUser, handleProfilePic, updateUser);
router.put("/password", protected, isUser, changePassword);

// USER APPOINTMENT ROUTES
// Book Appointment Route
// Get all Appointments Route
// Get single Appointment Route
// Cancel Appointment Route
router.post("/book-appointment", protected, isUser, bookAppointment);
router.get("/appointments", protected, isUser, getAppointmentsUser);
router.get("/appointments/:id", protected, isUser, getAppointmentByIdUser);
router.delete(
  "/appointments/:id/cancel",
  isUser,
  protected,
  cancelAppointmentUser
);

// USER LAB-REQUEST ROUTES
// Book lab requests Route
// Get all lab requests Route
// Get single lab request Route
// Cancel lab request Route
router.post("/book-lab-service", protected, isUser, bookLabService);
router.get("/lab-service", protected, isUser, getLabRequestsUser);
router.get("/lab-service/:id", protected, isUser, getLabRequestByIdUser);
router.delete(
  "/lab-service/:id/cancel",
  protected,
  isUser,
  cancelLabRequestUser
);

// USER POST ROUTES
// Get all posts Route
router.get("/posts", protected, getPostsUser);

// USER OVERVIEW ROUTES
// Get Overview route // Dashboard: stats of Appointments, LabRequets, etc
router.get("/overview", protected, isUser, getOverviewUser);

module.exports = router;
