const User = require("../models/User");

const userService = {
  // Get All Users
  getAdminUsers: async (user) => {
    return await User.find();
  },
  // Check if user already exists by email
  checkUserExists: async (email) => {
    return await User.findOne({ email });
  },

  // Create a new user
  createUser: async (user) => {
    return await User.create(user);
  },
  // Get a user by id
  getUserById: async (id) => {
    return await User.findById(id);
  },
  // Update user

  updateUser: async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select(
      "-password"
    );
  },

  //  updateUserPassword : async (userId, hashedPassword) => {
  // return await User.findByIdAndUpdate(
  //   userId,
  //   { password: hashedPassword },
  //   { new: true }
  // )
  // }
};

module.exports = userService;
