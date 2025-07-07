const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phoneNumber: { type: String, required: false },
  role: {
    type: String,
    enum: ["superadmin", "moderator", "content-manager"],
    default: "moderator",
  },
  permissions: {
    manageUsers: { type: Boolean, default: false },
    managePosts: { type: Boolean, default: false },
    manageProviders: { type: Boolean, default: false },
    manageAppointments: { type: Boolean, default: false },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Admin", AdminSchema);
