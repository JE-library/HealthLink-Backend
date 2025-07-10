const bcrypt = require("bcryptjs");
const {
  updateUserSchema,
  changePasswordSchema,
} = require("../../validations/user.validation");
const { getUserById, updateUser } = require("../../services/user.service");
const response = require("../../utils/response.util");

const cloudinary = require("../../config/cloudinary.config");
const fs = require("fs/promises");

//USER PROFILE CONTROLLER

const userProfileController = {
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

  //UPDATE USER PROFILE
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

  //CHANGE USER PASSWORD
  changePassword: async (req, res, next) => {
    try {
      // Validate input
      const { error, value } = changePasswordSchema.validate(req.body);
      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }

      const { currentPassword, newPassword } = value;

      const user = await getUserById(req.user._id);
      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        res.status(401);
        throw new Error("Current password is incorrect");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await updateUser(user._id, { password: hashedPassword });

      response(res, "message", "Password updated successfully");
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userProfileController;
