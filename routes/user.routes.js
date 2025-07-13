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

// File Upload Middileware
const { handleProfilePic } = require("../middlewares/upload.middleware.js");

// Auth Middleware
const protected = require("../middlewares/auth.middleware.js");

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
router.get("/profile", protected, getUser);
router.put("/profile", protected, handleProfilePic, updateUser);
router.put("/password", protected, changePassword);

// USER APPOINTMENT ROUTES
// Book Appointment Route
// Get all Appointments Route
// Get single Appointment Route
// Cancel Appointment Route
router.post("/book-appointment", protected, bookAppointment);
router.get("/appointments", protected, getAppointmentsUser);
router.get("/appointments/:id", protected, getAppointmentByIdUser);
router.delete("/appointments/:id/cancel", protected, cancelAppointmentUser);

// USER LAB-REQUEST ROUTES
// Book lab requests Route
// Get all lab requests Route
// Get single lab request Route
// Cancel lab request Route
router.post("/book-lab-service", protected, bookLabService);
router.get("/lab-service", protected, getLabRequestsUser);
router.get("/lab-service/:id", protected, getLabRequestByIdUser);
router.delete("/lab-service/:id/cancel", protected, cancelLabRequestUser);

// USER POST ROUTES
// Get all posts Route
router.get("/posts", protected, getPostsUser);

module.exports = router;
