const bcrypt = require("bcryptjs");
const { registerUserSchema } = require("../../validations/user.validation.js");
const {
  checkAdminExists,
  createAdmin,
} = require("../../services/admin.service.js");
const response = require("../../utils/response.util.js");
const { loginSchema } = require("../../validations/login.validation.js");
const generateToken = require("../../utils/jwt.util.js");

const cloudinary = require("../../config/cloudinary.config.js");
const fs = require("fs/promises");
const { createAdminSchema } = require("../../validations/admin.validation.js");

//ADMIN AUTH CONTROLLER

const AdminAuthController = {
  registerAdmin: async (req, res, next) => {
    try {
      //  Validate input
      const { error, value } = createAdminSchema.validate(req.body);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }
      const { fullName, email, phoneNumber, password } = value;

      //  check if Admin exists
      const existingAdmin = await checkAdminExists(email);
      if (existingAdmin) {
        res.status(400);
        throw new Error("Admin with this email already exists");
      }

      //  Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create Admin
      const admin = await createAdmin({
        fullName,
        email,
        phoneNumber,
        password: hashedPassword,
      });

      // Respond
      response(
        res,
        "admin",
        {
          _id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          phoneNumber: admin.phoneNumber,
          role: admin.role,
        },
        201
      );
    } catch (error) {
      next(error);
    }
  },

  //LOGIN ADMIN CONTROLLER
  loginAdmin: async (req, res, next) => {
    try {
      // Validate input
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }

      const { email, password } = value;

      // Fetch Admin
      const matchedAdmin = await checkAdminExists(email);
      if (!matchedAdmin) {
        res.status(401);
        throw new Error("Invalid email or password");
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, matchedAdmin.password);
      if (!isMatch) {
        res.status(401);
        throw new Error("Invalid email or password");
      }

      // Generate Token
      const token = generateToken({
        id: matchedAdmin._id,
        role: matchedAdmin.role,
      });

      // Respond
      response(
        res,
        "admin",
        {
          _id: matchedAdmin._id,
          fullName: matchedAdmin.fullName,
          email: matchedAdmin.email,
          phoneNumber: matchedAdmin.phoneNumber,
          role: matchedAdmin.role,
          token,
        },
        200
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AdminAuthController;
