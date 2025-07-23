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
  updateAppointmentStatusAdmin,
  deleteAppointmentAdmin,
} = require("../controllers/admin/adminAppointments.controller.js");
// Lab Controllers
const {
  getLabRequestsAdmin,
  getLabRequestByIdAdmin,
  updateLabRequestStatusAdmin,
  deleteLabRequestAdmin,
} = require("../controllers/admin/adminLabServices.controller.js");
// Posts Controllers
const {
  getPostsAdmin,
  getPostDetailsAdmin,
  deletePostAdmin,
} = require("../controllers/admin/adminPosts.controller.js");
// Overview Controllers
const {
  getOverviewAdmin
} = require("../controllers/admin/adminOverview.controller.js");

// Auth Middleware
const protected = require("../middlewares/auth.middleware.js");
const { isAdmin } = require("../middlewares/role.middleware.js");

// PROVIDER AUTH ROUTES
// Admin registration route
// Admin login route
// Admin Logout route
router.post("/register", registerAdmin);
// router.post("/logout", logoutProvider);

// PROTECTED ROUTES ////////////

// USER ROUTES
// Get all users Route
// Get single user Route
// Delete a user Route
router.get("/users", protected, isAdmin, getUsersAdmin);
router.get("/users/:id", protected, isAdmin, getUserDetailsAdmin);
router.delete("/users/:id/delete", isAdmin, protected, deleteUserAdmin);

// PROVIDER ROUTES
// Get all providers Route
// Get single provider Route
// Update provider Application Status Route
// Delete provider Route
router.get("/providers", protected, isAdmin, getProvidersAdmin);
router.get("/providers/:id", protected, isAdmin, getProviderDetailsAdmin);
router.put(
  "/providers/:id/status",
  protected,
  isAdmin,
  updateProviderStatusAdmin
);
router.delete("/providers/:id/delete", protected, isAdmin, deleteProviderAdmin);

// APPOINTMENT ROUTES
// Get all Appointments Route
// Get single Appointment Route
// Change Appointment status Route
// Delete Appointment Route
router.get("/appointments", protected, isAdmin, getAppointmentsAdmin);
router.get("/appointments/:id", protected, isAdmin, getAppointmentByIdAdmin);
router.patch(
  "/appointments/:id/status",
  protected,
  isAdmin,
  updateAppointmentStatusAdmin
);
router.delete(
  "/appointments/:id/delete",
  protected,
  isAdmin,
  deleteAppointmentAdmin
);

// LAB-REQUEST ROUTES
// Get all lab requests Route
// Get single lab request Route
// Change lab request status Route
// Delete lab request Route
router.get("/lab-services", protected, isAdmin, getLabRequestsAdmin);
router.get("/lab-services/:id", protected, isAdmin, getLabRequestByIdAdmin);
router.patch(
  "/lab-services/:id/status",
  protected,
  isAdmin,
  updateLabRequestStatusAdmin
);
router.delete(
  "/lab-services/:id/delete",
  protected,
  isAdmin,
  deleteLabRequestAdmin
);

// POST ROUTES
// Get all posts Route
// Get single post Route
// Delete post Route
router.get("/posts", protected, isAdmin, getPostsAdmin);
router.get("/posts/:id", protected, isAdmin, getPostDetailsAdmin);
router.delete("/posts/:id/delete", protected, isAdmin, deletePostAdmin);

// OVERVIEW ROUTES
// Get Overview route // Dashboard: stats of users, providers, etc
router.get("/overview", protected, isAdmin, getOverviewAdmin);

module.exports = router;
