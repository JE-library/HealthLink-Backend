const User = require("../models/User");

const userService = {
  // Check if user already exists by email
  checkUserExists: async (email) => {
    return await User.findOne({ email });
  },

  // Create a new user
  createUser: async (user) => {
    return await User.create({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: user.password,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      role: user.role,
    });
  },
};

module.exports = userService;
