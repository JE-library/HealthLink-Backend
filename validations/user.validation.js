const Joi = require("joi");

const registerUserSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  dateOfBirth: Joi.date().less("now").required(),
  address: Joi.string().min(3).optional(),
  profilePhoto: Joi.string().uri().optional(),
});

const updateUserSchema = Joi.object({
  fullName: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  phoneNumber: Joi.string(),
  password: Joi.string().min(6),
  gender: Joi.string().valid("male", "female", "other"),
  dateOfBirth: Joi.date().less("now"),
  address: Joi.string().min(3),
  profilePhoto: Joi.string().uri().optional(),
});


const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

module.exports = { registerUserSchema, updateUserSchema, changePasswordSchema };
