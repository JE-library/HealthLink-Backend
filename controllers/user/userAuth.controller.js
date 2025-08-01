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
const { postNotification } = require("../../services/notification.service.js");

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
      await postNotification({
        userId: user._id,
        title: "Welcome to HealthLink",
        message: `Hi ${user.fullName}, your account has been successfully created.`,
        type: "info",
      });
      //SENDING WELCOME EMAIL TO USER
      sendEmail({ fullName, email });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userAuthController;
