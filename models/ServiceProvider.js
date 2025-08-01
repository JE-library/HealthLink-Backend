const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceProviderSchema = new Schema(
  {
    // Basic Sign-Up Info
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phoneNumber: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },
    role: { type: String, default: "serviceProvider" },
    profilePhoto: {
      url: {
        type: String,
        default:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      },
      public_id: { type: String },
    },
    // Professional Details
    professionalTitle: { type: String, required: true }, // e.g. "Dr.", "RDN", "PT"
    specialization: {
      type: String,
      enum: [
        "nutritionist",
        "therapist",
        "dermatologist",
        "pharmacist",
        "lab technician",
        "physiotherapist",
      ],
      required: true,
    },
    experienceYears: { type: Number, required: true },
    labTestsOffered: [
      {
        type: String,
        trim: true,
      },
    ],
    bio: { type: String, maxlength: 1000, default: "No Bio" },

    certifications: [
      {
        certificate: String,
        public_id: String,
      },
    ],
    consultationModes: {
      video: { type: Boolean, default: false },
      chat: { type: Boolean, default: true },
      audio: { type: Boolean, default: false },
    },
    isAvailable: { type: Boolean, default: true },
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

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "banned"],
      default: "pending",
    },
    note: {
      message: { type: String, default: "Your application is under review." },
      date: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceProvider", ServiceProviderSchema);
