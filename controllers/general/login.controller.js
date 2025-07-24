const bcrypt = require("bcryptjs");
const { registerUserSchema } = require("../../validations/user.validation");
const {
  createUser,
  checkUserExists,
} = require("../../services/user.service.js");
const response = require("../../utils/response.util");
const { loginSchema } = require("../../validations/login.validation.js");
const generateToken = require("../../utils/jwt.util.js");

const cloudinary = require("../../config/cloudinary.config");
const fs = require("fs/promises");
const sendEmail = require("../../utils/sendMail.utils.js");
const ServiceProvider = require("../../models/ServiceProvider.js");
const User = require("../../models/User.js");

//USER AUTH CONTROLLER

const loginController = {
  login: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      // Validate input
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }

      const { email, password } = value;

      // Chef is user exists
      let matchedUser = await User.findOne({ email });
      if (!matchedUser) {
        //check if provider Exists
        matchedUser = await ServiceProvider.findOne({ email });
        if (!matchedUser) {
          res.status(401);
          throw new Error("Invalid email or password");
        }
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, matchedUser.password);
      if (!isMatch) {
        res.status(401);
        throw new Error("Invalid email or password");
      }

      // Generate Token
      const token = generateToken({
        id: matchedUser._id,
        role: matchedUser.role,
      });

      // Respond
      response(
        res,
        "user",
        {
          _id: matchedUser._id,
          fullName: matchedUser.fullName,
          email: matchedUser.email,
          phoneNumber: matchedUser.phoneNumber,
          role: matchedUser.role,
          token,
          status: matchedUser?.status
        },
        200
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = loginController;
