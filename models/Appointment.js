const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Appointment Schema
const AppointmentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceProvider: {
      type: Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true }, // e.g. "10:00-10:30"
    mode: {
      type: String,
      enum: ["video", "chat", "audio", "in-person"],
      default: "chat",
    },
    videoLink: {
      type: String,
      default: "https://meet.google.com/tcd-qfwy-cxy",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: { type: String, default: "No Notes Provided" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
