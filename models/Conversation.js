const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Conversation Schema
const ConversationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceProvider: {
      type: Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },

    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
