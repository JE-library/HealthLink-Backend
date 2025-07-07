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
  author: { type: Schema.Types.ObjectId },
  tags: [String], // For filtering/search (e.g., "sleep", "vitamins")
  imageUrl: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  published: { type: Boolean, default: true },
});

module.exports = mongoose.model("Post", PostSchema);
