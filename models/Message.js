const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//  Message Schema
const MessageSchema = new Schema(
  {
    conversationId: { type: Schema.Types.ObjectId, required: true }, // Could link to a Conversation model if needed
    senderId: {
      type: Schema.Types.ObjectId,
      refPath: "senderModel",
      required: true,
    },
    senderModel: {
      type: String,
      enum: ["User", "ServiceProvider", "Admin"],
      required: true,
    },
    message: { type: String, required: true },
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
