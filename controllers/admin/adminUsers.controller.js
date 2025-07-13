const response = require("../../utils/response.util.js");
const User = require("../../models/User.js");
const cloudinary = require("../../config/cloudinary.config.js");
const {
  getProviderAppointments,
  cancelProviderAppointment,
  getProviderAppointmentDetails,
  confirmProviderAppointment,
} = require("../../services/appointment.service.js");
const { postNotification } = require("../../services/notification.service.js");
const { default: mongoose } = require("mongoose");
const {
  getAdminUsers,
  getUserById,
} = require("../../services/user.service.js");
const Notification = require("../../models/Notification.js");

// ADMIN USERS CONTROLLER

const adminUsersController = {
  //GET ALL USERS
  getUsersAdmin: async (req, res, next) => {
    try {
      const users = await getAdminUsers();

      //if there's no users respond with none found
      if (!users || users.length === 0) {
        return response(res, "users", [], 200, true, "No users found");
      }
      // Respond with the all users
      response(res, "users", users);
    } catch (error) {
      next(error);
    }
  },

  // GET SINGLE USER DETAILS
  getUserDetailsAdmin: async (req, res, next) => {
    try {
      const userId = req.params.id;

      //check if the userId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
      }
      const user = await getUserById(userId);

      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }
      response(res, "user", user, 200, true, "User Retrieved Successfully.");
    } catch (error) {
      next(error);
    }
  },
  // DELETE USER
  deleteUserAdmin: async (req, res, next) => {
    try {
      const userId = req.params.id;

      //check if the usersId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
      }
      const user = await getUserById(userId);
      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }
      //delete avatar from cloudinary
      await cloudinary.uploader.destroy(user.profilePhoto.public_id);
      //delete users notifications
      await Notification.deleteMany({ user: user._id });

      const deletedUser = await User.deleteOne({ _id: userId });

      response(
        res,
        "deletedUser",
        deletedUser,
        200,
        true,
        "User Deleted Successfully!"
      );
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminUsersController;
