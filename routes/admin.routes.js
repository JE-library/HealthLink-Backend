const { Router } = require("express");
const router = Router();
// Auth Controllers
const {
  registerAdmin,
  loginAdmin,
} = require("../controllers/admin/adminsAuth.controller.js");
// Users Controllers
const {
  getUsersAdmin,
  getUserDetailsAdmin,
  deleteUserAdmin,
} = require("../controllers/admin/adminUsers.controller.js");
// Provider Controllers
const {
  getProvidersAdmin,
  getProviderDetailsAdmin,
  updateProviderStatusAdmin,
  deleteProviderAdmin,
} = require("../controllers/admin/adminProviders.controller.js");
// Appointment Controllers
const {
  getAppointmentsAdmin,
  getAppointmentByIdAdmin,
  changeAppointmentStatusAdmin,
  deleteAppointmentAdmin,
} = require("../controllers/serviceProvider/providerAppointment.controller.js");
// Lab Controllers
const {
  getLabRequestsAdmin,
  getLabRequestByIdAdmin,
  changeLabRequestStatusAdmin,
  deleteLabRequestAdmin,
} = require("../controllers/serviceProvider/providerLabService.controller.js");
// Posts Controllers
const {
  getPostsAdmin,
  getPostDetailsAdmin,
  deletePostAdmin,
} = require("../controllers/serviceProvider/providerPosts.controller.js");
// Overview Controllers
const {
  getOverviewAdmin,
} = require("../controllers/serviceProvider/providerPosts.controller.js");

// Auth Middleware
const protected = require("../middlewares/auth.middleware.js");

// PROVIDER AUTH ROUTES
// Admin registration route
// Admin login route
// Admin Logout route
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
// router.post("/logout", logoutProvider);

// PROTECTED ROUTES ////////////

// USER ROUTES
// Get all users Route
// Get single user Route
// Delete a user Route
router.get("/users", protected, getUsersAdmin);
router.get("/users/:id", protected, getUserDetailsAdmin);
router.delete("/users/:id/delete", protected, deleteUserAdmin);

// PROVIDER ROUTES
// Get all providers Route
// Get single provider Route
// Update provider Application Status Route
// Delete provider Route
router.get("/providers", protected, getProvidersAdmin);
router.get("/providers/:id", protected, getProviderDetailsAdmin);
router.put("/providers/:id/status", protected, updateProviderStatusAdmin);
router.delete("/providers/:id/delete", protected, deleteProviderAdmin);

// APPOINTMENT ROUTES
// Get all Appointments Route
// Get single Appointment Route
// Change Appointment status Route
// Delete Appointment Route
// router.get("/appointments", protected, getAppointmentsAdmin);
// router.get("/appointments/:id", protected, getAppointmentByIdAdmin);
// router.patch(
//   "/appointments/:id/status",
//   protected,
//   changeAppointmentStatusAdmin
// );
// router.delete("/appointments/:id/delete", protected, deleteAppointmentAdmin);

// LAB-REQUEST ROUTES
// Get all lab requests Route
// Get single lab request Route
// Change lab request status Route
// Delete lab request Route
// router.get("/lab-service", protected, getLabRequestsAdmin);
// router.get("/lab-service/:id", protected, getLabRequestByIdAdmin);
// router.patch("/lab-service/:id/status", protected, changeLabRequestStatusAdmin);
// router.delete("/lab-service/:id/delete", protected, deleteLabRequestAdmin);

// POST ROUTES
// Get all posts Route
// Get single post Route
// Delete post Route
// router.get("/posts", protected, getPostsAdmin);
// router.get("/posts/:id", protected, getPostDetailsAdmin);
// router.delete("/posts/:id/delete", protected, deletePostAdmin);

// OVERVIEW ROUTES
// Get Overview route // Dashboard: stats of users, providers, etc
// router.get("/overview", protected, getOverviewAdmin);

module.exports = router;
