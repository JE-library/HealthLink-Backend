const { Router } = require("express");
const router = Router();
// Auth Controllers
const {
  registerProvider,
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
  createConversationProvider,
  getConversationsProvider,
  getConversationByIdProvider,
  sendMessageProvider,
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
// Overview Controllers
const {
  getOverviewProvider,
} = require("../controllers/serviceProvider/providerOverview.controller.js");

// File Upload Middileware
const {
  handleDocsAndProfilePic,
  handleProfilePic,
  handlePostsImage,
  handleLabResult,
} = require("../middlewares/upload.middleware.js");

// Auth Middleware
const protected = require("../middlewares/auth.middleware.js");
const { isProvider } = require("../middlewares/role.middleware.js");

// PROVIDER AUTH ROUTES
// Register route
// Logout route
router.post("/register", handleDocsAndProfilePic, registerProvider);
// router.post("/logout", logoutProvider);

// PROTECTED ROUTES ////////////

// PROVIDER PROFILE ROUTES
// Get Provider profile Route
// Update Provider profile Route
// Update Provider TimeSlots Route
// Toggle Provider Availability Route
// Change Provider Route
router.get("/profile", protected, isProvider, getProvider);
router.put("/profile", protected, isProvider, handleProfilePic, updateProvider);
router.put("/availability", protected, isProvider, updateAvailabilityProvider);
router.patch(
  "/is-available",
  protected,
  isProvider,
  toggleAvailabilityProvider
);
router.put("/password", protected, isProvider, changePasswordProvider);

// PROVIDER APPOINTMENT ROUTES
// Get all Appointments Route
// Get single Appointment Route
// Confirm an Appointment Route
// Cancel Appointment Route
//
// Create a new Conversation
// Get All Conversations
// Get single Conversation
// Send message
router.get("/appointments", protected, isProvider, getAppointmentsProvider);
router.get(
  "/appointments/:id",
  protected,
  isProvider,
  getAppointmentByIdProvider
);
router.patch(
  "/appointments/:id/confirm",
  protected,
  isProvider,
  confirmAppointmentProvider
);
router.delete(
  "/appointments/:id/cancel",
  protected,
  isProvider,
  cancelAppointmentProvider
);
router.post(
  "/appointments/:id/chat",
  protected,
  isProvider,
  createConversationProvider
);
router.get("/chats", protected, isProvider, getConversationsProvider);
router.get("/chats/:id", protected, isProvider, getConversationByIdProvider);
router.post(
  "/chats/:id/send-message",
  protected,
  isProvider,
  sendMessageProvider
);

// PROVIDER LAB-REQUEST ROUTES
// Get all lab requests Route
// Get single lab request Route
// Confirm a lab request Route
// Upload a lab Result Route
// Cancel lab request Route
router.get("/lab-service", protected, isProvider, getLabRequestsProvider);
router.get(
  "/lab-service/:id",
  protected,
  isProvider,
  getLabRequestByIdProvider
);
router.patch(
  "/lab-service/:id/confirm",
  protected,
  isProvider,
  confirmLabRequestProvider
);
router.put(
  "/lab-service/:id/result",
  protected,
  isProvider,
  handleLabResult,
  uploadLabResultProvider
);
router.delete(
  "/lab-service/:id/cancel",
  protected,
  isProvider,
  cancelLabRequestProvider
);

// PROVIDER NOTIFICATION ROUTES
// Get all notifications Route
// Mark notification As Read Route
// router.get("/notifications", protected, getNotifications);
// router.patch("/notifications/:id", protected, markNotificationAsRead);

// PROVIDER POST ROUTES
// Create posts Route
// Get all posts Route
// Get single post Route
// Update post Route
// Delete post Route
router.post(
  "/posts",
  protected,
  isProvider,
  handlePostsImage,
  createPostProvider
);
router.get("/posts", protected, isProvider, getPostsProvider);
router.get("/posts/:id", protected, isProvider, getSinglePostProvider);
router.put(
  "/posts/:id",
  protected,
  isProvider,
  handlePostsImage,
  updatePostProvider
);
router.delete("/posts/:id/delete", isProvider, protected, deletePostProvider);

// PROVIDER OVERVIEW ROUTES
// Get Overview route // Dashboard: stats of Appointments, LabRequets, etc
router.get("/overview", protected, isProvider, getOverviewProvider);

module.exports = router;
