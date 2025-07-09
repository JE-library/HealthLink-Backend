const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Conversation Schema
const ConversationSchema = new Schema({
  participants: [
    {
      userId: { type: Schema.Types.ObjectId, required: true },
      role: { type: String, enum: ["User", "ServiceProvider", "Admin"] },
    },
  ],
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Conversation", ConversationSchema);
