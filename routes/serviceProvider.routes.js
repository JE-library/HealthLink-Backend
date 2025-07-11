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
  updateProviderAvailability,
  toggleProviderAvailability,
  changeProviderPassword,
} = require("../controllers/serviceProvider/providerProfile.controller.js");

// File Upload Middileware
const {
  handleDocsAndProfilePic,
  handleProfilePic,
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
router.put("/availability", protected, updateProviderAvailability);
router.patch("/is-available", protected, toggleProviderAvailability);
router.put("/password", protected, changeProviderPassword);

// PROVIDER APPOINTMENT ROUTES
// Get all Appointments Route
// Get single Appointment Route
// Cancel Appointment Route
// router.get("/appointments", protected, getProviderAppointments);
// router.get("/appointments/:id", protected, getAppointmentDetails);
// router.put("/appointments/:id/status", protected, cancelProviderAppointment);

// PROVIDER LAB-REQUEST ROUTES
// Get all lab requests Route
// Get single lab request Route
// Cancel lab request Route
// router.get("/lab-service", protected, getProviderLabRequests);
// router.get("/lab-service/:id", protected, getProviderLabRequestById);
// router.delete("/lab-service/:id", protected, cancelProviderLabRequest);

// PROVIDER NOTIFICATION ROUTES
// Get all notifications Route
// Mark notification As Read Route
// router.get("/notifications", protected, getNotifications);
// router.patch("/notifications/:id", protected, markNotificationAsRead);

// USER POST ROUTES
// Get all posts Route
// Create posts Route
// router.get("/posts", protected, getProviderPosts);
// router.post("/posts", protected, createProviderPost);

module.exports = router;
