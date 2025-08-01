const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phoneNumber: { type: String,  },
    gender: { type: String, enum: ["male", "female", "other"],  },
    dateOfBirth: { type: Date, },
    role: { type: String, default: "user" },
    address: { type: String, default: "" },
    profilePhoto: {
      url: {
        type: String,
        default:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      },
      public_id: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);



