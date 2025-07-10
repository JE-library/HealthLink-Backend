const Joi = require("joi");

const labRequestSchema = Joi.object({
  serviceProviderId: Joi.string().required(),
  tests: Joi.array().items(Joi.string().trim().min(1)).min(1).required(),
  date: Joi.date().required(),
  timeSlot: Joi.string().required(),
  notes: Joi.string().optional().allow(""),
});

module.exports = {
  labRequestSchema,
};
