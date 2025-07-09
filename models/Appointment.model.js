const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 1. Appointment Schema
const AppointmentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  serviceProvider: {
    type: Schema.Types.ObjectId,
    ref: "ServiceProvider",
    required: true,
  },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g. "10:00-10:30"
  mode: {
    type: String,
    enum: ["video", "chat", "audio", "in-person"],
    default: "in-person",
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
