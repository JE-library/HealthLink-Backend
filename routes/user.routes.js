const { Router } = require("express");
const router = Router();

// Controllers
const {
  registerUser,
  //   loginUser,
  //   logoutUser,
  //   getUserProfile,
  //   updateUserProfile,
} = require("../controllers/user.controller.js");

// Auth Middleware
const protected = require("../middlewares/auth.middleware.js");

// Routes

// Public routes
router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.post("/logout", logoutUser);

// Protected routes (require auth)
// router.get("/profile", protect, getUserProfile);
// router.put("/profile", protect, updateUserProfile);

module.exports = router;
