const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    postImage: { url: { type: String }, public_id: { type: String } },
    categories: [
      {
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
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    tags: [String], // For filtering/search (e.g., "sleep", "vitamins")
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
