const Joi = require("joi");

const ambulanceRequestSchema = Joi.object({
  location: Joi.object({
    address: Joi.string().required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(), // [longitude, latitude]
  }).required(),

  emergencyType: Joi.string().required(),
});

module.exports = {
  ambulanceRequestSchema,
};
