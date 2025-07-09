const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceProviderSchema = new Schema({
  // Basic Sign-Up Info
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phoneNumber: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"] },
  dateOfBirth: { type: Date },
  address: { type: String },
  profileImage: { type: String }, // optional profile photo URL
  // Professional Details
  specialization: {
    type: String,
    enum: [
      "doctor",
      "nutritionist",
      "therapist",
      "dermatologist",
      "spa_agent",
      "pharmacist",
      "lab_technician",
      "physiotherapist",
    ],
    required: true,
  },
  professionalTitle: { type: String }, // e.g. "Dr.", "RDN", "PT"
  bio: { type: String, maxlength: 1000 },
  certifications: [
    {
      title: String,
      fileUrl: String,
      issuedBy: String,
      year: Number,
    },
  ],
  experienceYears: { type: Number, default: 0 },
  consultationModes: {
    video: { type: Boolean, default: true },
    chat: { type: Boolean, default: true },
    audio: { type: Boolean, default: false },
  },
  availability: [
    {
      day: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
      timeSlots: [String],
    },
  ],
  rating: { type: Number, default: 0 },
  reviews: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      comment: String,
      rating: Number,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  metadata: {
    clinicName: String,
    location: String,
    verified: { type: Boolean, default: false },
    languagesSpoken: [String],
  },
  appointments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
