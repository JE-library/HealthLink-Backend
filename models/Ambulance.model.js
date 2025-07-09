// 2. Ambulance Request Schema
const AmbulanceRequestSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  location: {
    address: { type: String, required: true },
    coordinates: { type: [Number], index: "2dsphere" }, // [longitude, latitude]
  },
  emergencyType: { type: String, required: true },
  status: {
    type: String,
    enum: ["requested", "dispatched", "completed", "cancelled"],
    default: "requested",
  },
  requestedAt: { type: Date, default: Date.now },
  dispatchedAt: { type: Date },
  completedAt: { type: Date },
});

module.exports = mongoose.model("AmbulanceRequest", AmbulanceRequestSchema);
