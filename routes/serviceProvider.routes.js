const { Router } = require("express");
const router = Router();
// Auth Controllers
const {
  registerProvider,
  loginProvider,
} = require("../controllers/serviceProvider/providerAuth.controller.js");
// Profile Controllers
const {
  getProvider,
  updateProvider,
  updateAvailabilityProvider,
  toggleAvailabilityProvider,
  changePasswordProvider,
} = require("../controllers/serviceProvider/providerProfile.controller.js");
// Appointment Controllers
const {
  getAppointmentsProvider,
  getAppointmentByIdProvider,
  confirmAppointmentProvider,
  cancelAppointmentProvider,
} = require("../controllers/serviceProvider/providerAppointment.controller.js");
// Lab Controllers
const {
  getLabRequestsProvider,
  getLabRequestByIdProvider,
  confirmLabRequestProvider,
  uploadLabResultProvider,
  cancelLabRequestProvider,
} = require("../controllers/serviceProvider/providerLabService.controller.js");
// Posts Controllers
const {
  createPostProvider,
  getPostsProvider,
  getSinglePostProvider,
  updatePostProvider,
  deletePostProvider,
} = require("../controllers/serviceProvider/providerPosts.controller.js");

// File Upload Middileware
const {
  handleDocsAndProfilePic,
  handleProfilePic,
  handlePostsImage,
  handleLabResult,
} = require("../middlewares/upload.middleware.js");

// Auth Middleware
const protected = require("../middlewares/auth.middleware.js");

// PROVIDER AUTH ROUTES
// Register route
// Login route
// Logout route
router.post("/register", handleDocsAndProfilePic, registerProvider);
router.post("/login", loginProvider);
// router.post("/logout", logoutProvider);

// PROTECTED ROUTES ////////////

// PROVIDER PROFILE ROUTES
// Get Provider profile Route
// Update Provider profile Route
// Update Provider TimeSlots Route
// Toggle Provider Availability Route
// Change Provider Route
router.get("/profile", protected, getProvider);
router.put("/profile", protected, handleProfilePic, updateProvider);
router.put("/availability", protected, updateAvailabilityProvider);
router.patch("/is-available", protected, toggleAvailabilityProvider);
router.put("/password", protected, changePasswordProvider);

// PROVIDER APPOINTMENT ROUTES
// Get all Appointments Route
// Get single Appointment Route
// Confirm an Appointment Route
// Cancel Appointment Route
router.get("/appointments", protected, getAppointmentsProvider);
router.get("/appointments/:id", protected, getAppointmentByIdProvider);
router.patch(
  "/appointments/:id/confirm",
  protected,
  confirmAppointmentProvider
);
router.delete("/appointments/:id/cancel", protected, cancelAppointmentProvider);

// PROVIDER LAB-REQUEST ROUTES
// Get all lab requests Route
// Get single lab request Route
// Confirm a lab request Route
// Upload a lab Result Route
// Cancel lab request Route
router.get("/lab-service", protected, getLabRequestsProvider);
router.get("/lab-service/:id", protected, getLabRequestByIdProvider);
router.patch("/lab-service/:id/confirm", protected, confirmLabRequestProvider);
router.put(
  "/lab-service/:id/result",
  protected,
  handleLabResult,
  uploadLabResultProvider
);
router.delete("/lab-service/:id/cancel", protected, cancelLabRequestProvider);

// PROVIDER NOTIFICATION ROUTES
// Get all notifications Route
// Mark notification As Read Route
// router.get("/notifications", protected, getNotifications);
// router.patch("/notifications/:id", protected, markNotificationAsRead);

// USER POST ROUTES
// Create posts Route
// Get all posts Route
// Get single post Route
// Update post Route
// Delete post Route
router.post("/posts", protected, handlePostsImage, createPostProvider);
router.get("/posts", protected, getPostsProvider);
router.get("/posts/:id", protected, getSinglePostProvider);
router.put("/posts/:id", protected, handlePostsImage, updatePostProvider);
router.delete("/posts/:id/delete", protected, deletePostProvider);

module.exports = router;
