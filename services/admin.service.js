const Admin = require("../models/Admin");

const adminService = {
  // Check if admin already exists by email
  checkAdminExists: async (email) => {
    return await Admin.findOne({ email });
  },

  // Create a new Admin
  createAdmin: async (user) => {
    return await Admin.create(user);
  },


};

module.exports = adminService;
