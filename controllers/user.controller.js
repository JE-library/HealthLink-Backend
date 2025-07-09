const bcrypt = require("bcryptjs");
const {
  registerUserSchema,
  updateUserSchema,
} = require("../validations/user.validation");
const {
  createUser,
  checkUserExists,
  getUserById,
  updateUser,
} = require("../services/user.service.js");
const response = require("../utils/response.util");
const { loginSchema } = require("../validations/login.validation.js");
const generateToken = require("../utils/jwt.util.js");

const cloudinary = require("../config/cloudinary.config");
const fs = require("fs/promises");

//USER CONTROLLER

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
        fs.unlink(req.file.path);
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
        },
        201
      );
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

  //GETTING USER PROFILE
  getUser: async (req, res, next) => {
    try {
      const user = await getUserById(req.user._id);
      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      response(res, "user", user);
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { error, value } = updateUserSchema.validate(req.body);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }

      const userId = req.user._id;
      const existingUser = await getUserById(userId);
      if (!existingUser) {
        res.status(404);
        throw new Error("User not found");
      }

      // Handle profile photo if uploaded
      if (req.file) {
        // Delete old photo from Cloudinary if it exists
        if (existingUser.profilePhoto.public_id) {
          await cloudinary.uploader.destroy(
            existingUser.profilePhoto.public_id
          );
        }
        // Upload new photo
        const upload = await cloudinary.uploader.upload(req.file.path, {
          folder: "healthlink/users",
        });

        // Delete the local file
        fs.unlink(req.file.path);
        //Add Image data to
        value.profilePhoto = {
          url: upload.secure_url,
          public_id: upload.public_id,
        };
      }

      const updatedUser = await updateUser(req.user._id, value);

      if (!updatedUser) {
        res.status(404);
        throw new Error("User not found");
      }

      response(res, "user", updatedUser);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
