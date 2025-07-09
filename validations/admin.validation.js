const Joi = require("joi");

const createAdminSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.string().required(),
});

module.exports = { createAdminSchema };
