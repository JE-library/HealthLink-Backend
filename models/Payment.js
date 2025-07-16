const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//  Payment Schema
const PaymentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "wallet", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: { type: String, unique: true },
    relatedAppointment: { type: Schema.Types.ObjectId, ref: "Appointment" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
