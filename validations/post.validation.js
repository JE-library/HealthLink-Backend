const Joi = require("joi");

const postSchema = Joi.object({
  title: Joi.string().trim().required(),
  content: Joi.string().required(),
  category: Joi.string()
    .valid(
      "wellness",
      "nutrition",
      "mental_health",
      "exercise",
      "diet",
      "general"
    )
    .default("general"),

  tags: Joi.array().items(Joi.string()).optional(),

  imageUrl: Joi.string().uri().optional(),
});

module.exports = {
  postSchema,
};
