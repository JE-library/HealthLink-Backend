const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//  LabRequest Schema
const LabRequestSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  serviceProvider: {
    type: Schema.Types.ObjectId,
    ref: "ServiceProvider",
    required: true,
  },
  tests: [{ type: String, required: true }], // e.g. ["blood test", "MRI"]
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g. "10:00-10:30"
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  notes: { type: String },
  resultsUrl: { type: String }, // link to lab report
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LabRequest", LabRequestSchema);
