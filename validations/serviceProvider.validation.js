const Joi = require("joi");

const registerServiceProviderSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phoneNumber: Joi.number().required(),
  gender: Joi.string().required(),
  address: Joi.string().required(),
  profilePhoto: Joi.string().uri().optional(),
  experienceYears: Joi.number().required(),
  professionalTitle: Joi.string().required(),
  certifications: Joi.array().optional(),
  title: Joi.array().optional(),
  issuedBy: Joi.array().optional(),
  year: Joi.array().optional(),
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
  dateOfBirth: Joi.date().required(),
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

const updateProviderSchema = Joi.object({
  fullName: Joi.string(),
  email: Joi.string().email(),
  phoneNumber: Joi.number(),
  gender: Joi.string(),
  address: Joi.string(),
  profilePhoto: Joi.string().uri().optional(),
  experienceYears: Joi.number(),
  professionalTitle: Joi.string(),
  dateOfBirth: Joi.date(),
  bio: Joi.string().max(1000),
  consultationModes: Joi.object({
    video: Joi.boolean(),
    chat: Joi.boolean(),
    audio: Joi.boolean(),
  }),
});

const updateProviderAvailabilitySchema = Joi.object({
  availability: Joi.array()
    .items(
      Joi.object({
        day: Joi.string()
          .valid(
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          )
          .required(),
        timeSlots: Joi.array().items(Joi.string()).required(),
      })
    )
    .min(1)
    .required(),
});
module.exports = {
  registerServiceProviderSchema,
  updateProviderSchema,
  updateProviderAvailabilitySchema,
};
