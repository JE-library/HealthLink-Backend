const Joi = require("joi");

const registerUserSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  dateOfBirth: Joi.date().less("now").required(),
  address: Joi.string().min(3).required(),
});

module.exports = { registerUserSchema };
