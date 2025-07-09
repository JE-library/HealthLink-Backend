const { Router } = require("express");
const router = Router();

// Controllers
const {
  registerUser,
  loginUser,
  //   logoutUser,
  getUser,
  updateUser,
} = require("../controllers/user.controller.js");

// Auth Middleware
const protected = require("../middlewares/auth.middleware.js");
const upload = require("../middlewares/upload.middleware.js");

// Routes

// Public routes
router.post("/register", upload.single("profilePhoto"), registerUser);
router.post("/login", loginUser);
// router.post("/logout", logoutUser);

// Protected routes
router.get("/profile", protected, getUser);
router.put("/profile", protected, upload.single("profilePhoto"), updateUser);

module.exports = router;
