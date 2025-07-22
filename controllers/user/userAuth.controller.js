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

//USER AUTH CONTROLLER

const userAuthController = {
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
        profilePhoto,
      } = value;

      //  User service to check if user exists
      const existingUser = await checkUserExists(email);
      if (existingUser) {
        res.status(400);
        throw new Error("User with this email already exists");
      }

      // Upload profile photo if provided
      let profilePhotoData = {};

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "healthlink/users",
        });

        profilePhotoData = {
          url: result.secure_url,
          public_id: result.public_id,
        };
        // Delete the local file
        await fs.unlink(req.file.path);
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
        profilePhoto: profilePhotoData,
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
          profilePhoto: user.profilePhoto,
        },
        201
      );
      //SENDING WELCOME EMAIL TO USER
      sendEmail({ fullName, email });
    } catch (error) {
      next(error);
    }
  },

  //LOGIN USER CONTROLLER
  loginUser: async (req, res, next) => {
    try {
      // Validate input
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }

      const { email, password } = value;

      // Fetch user
      const matchedUser = await checkUserExists(email);
      if (!matchedUser) {
        res.status(401);
        throw new Error("Invalid email or password");
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
        },
        200
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userAuthController;
