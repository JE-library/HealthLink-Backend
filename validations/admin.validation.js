const Joi = require("joi");

const createAdminSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string().required(),
});

const updateProviderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "approved", "rejected", "banned")
    .required(),
  message: Joi.string().required(),
});

module.exports = { createAdminSchema, updateProviderStatusSchema };
