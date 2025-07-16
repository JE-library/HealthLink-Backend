const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Conversation Schema
const ConversationSchema = new Schema(
  {
    participants: [
      {
        userId: { type: Schema.Types.ObjectId, required: true },
        role: { type: String, enum: ["User", "ServiceProvider", "Admin"] },
      },
    ],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
