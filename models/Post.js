const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "wellness",
      "nutrition",
      "mental_health",
      "exercise",
      "diet",
      "general",
    ],
    default: "general",
  },
  ServiceProvider: {
    type: Schema.Types.ObjectId,
    ref: "ServiceProvider",
    required: true,
  },
  tags: [String], // For filtering/search (e.g., "sleep", "vitamins")
  imageUrl: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", PostSchema);
