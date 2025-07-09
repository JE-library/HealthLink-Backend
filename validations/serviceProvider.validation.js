const Joi = require("joi");

const registerServiceProviderSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),

  specialization: Joi.string()
    .valid(
      "doctor",
      "nutritionist",
      "therapist",
      "dermatologist",
      "spa_agent",
      "pharmacist",
      "lab_technician",
      "physiotherapist"
    )
    .required(),

  professionalTitle: Joi.string().optional(),

  dateOfBirth: Joi.date().optional(),

  bio: Joi.string().max(1000).optional(),

  availability: Joi.array()
    .items(
      Joi.object({
        day: Joi.string().valid(
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ),
        timeSlots: Joi.array().items(Joi.string()),
      })
    )
    .optional(),

  consultationModes: Joi.object({
    video: Joi.boolean().default(true),
    chat: Joi.boolean().default(true),
    audio: Joi.boolean().default(false),
  }).optional(),
});

module.exports = {
  registerServiceProviderSchema,
};
