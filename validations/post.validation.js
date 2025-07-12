const Joi = require("joi");

const postSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  postImage: Joi.string().uri().optional(),
  categories: Joi.array()
    .items(
      Joi.string()
        .valid(
          "wellness",
          "nutrition",
          "mental_health",
          "exercise",
          "diet",
          "general"
        )
        .default("general")
    )
    .required(),

  tags: Joi.array().items(Joi.string()).optional(),
});
const updatePostSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  // postImage: Joi.string().uri().optional(),
  categories: Joi.array()
    .items(
      Joi.string()
        .valid(
          "wellness",
          "nutrition",
          "mental_health",
          "exercise",
          "diet",
          "general"
        )
        .default("general")
    )
    .optional(),

  tags: Joi.array().items(Joi.string()).optional(),
});

module.exports = {
  postSchema,
  updatePostSchema,
};
