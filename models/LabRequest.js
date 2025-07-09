const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//  LabRequest Schema
const LabRequestSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tests: [{ type: String, required: true }], // e.g. ["blood test", "MRI"]
  requestedDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed", "cancelled"],
    default: "pending",
  },
  ServiceProvider: { type: Schema.Types.ObjectId, ref: "ServiceProvider" }, // if assigned
  resultsUrl: { type: String }, // link to lab report
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LabRequest", LabRequestSchema);
