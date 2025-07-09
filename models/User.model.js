const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { ype: String, required: true, minlength: 6 },
  phoneNumber: { ype: String, required: true },
  gender: { ype: String, enum: ["male", "female", "other"], required: false },
  dateOfBirth: { ype: Date, required: false },
  address: { ype: String, required: false },
  appointments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  createdAt: { ype: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);


