const Joi = require("joi");

const registerUserSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().optional(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  dateOfBirth: Joi.date().less("now").optional(),
  address: Joi.string().min(3).optional(),
  profilePhoto: Joi.string().uri().optional(),
});

const updateUserSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).allow("", null).optional(),
  email: Joi.string().email().allow("", null).optional(),
  phoneNumber: Joi.string().allow("", null).optional(),
  password: Joi.string().min(6).allow("", null).optional(),
  gender: Joi.string()
    .valid("male", "female", "other")
    .allow("", null)
    .optional(),
  dateOfBirth: Joi.date().less("now").allow("", null).optional(),
  address: Joi.string().min(3).allow("", null).optional(),
  profilePhoto: Joi.string().uri().allow("", null).optional(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

module.exports = { registerUserSchema, updateUserSchema, changePasswordSchema };
