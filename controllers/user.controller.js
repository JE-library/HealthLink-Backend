const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { registerUserSchema } = require("../validations/user.validation");
const { createUser, checkUserExists } = require("../services/user.service.js");
const response = require("../utils/response.util");

const userController = {
  registerUser: async (req, res, next) => {
    try {
      //  Validate input
      const { error, value } = registerUserSchema.validate(req.body);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }
      const {
        fullName,
        email,
        phoneNumber,
        password,
        gender,
        dateOfBirth,
        address,
      } = value;

      //  User service to check if user exists
      const existingUser = await checkUserExists(email);
      if (existingUser) {
        res.status(400);
        throw new Error("User with this email already exists");
      }

      //  Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await createUser({
        fullName,
        email,
        phoneNumber,
        password: hashedPassword,
        gender,
        dateOfBirth,
        address,
      });

      // Respond
      response(
        res,
        "user",
        {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
        },
        201
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
