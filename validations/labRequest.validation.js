const Joi = require("joi");

const labRequestSchema = Joi.object({
  tests: Joi.array().items(Joi.string().trim().min(1)).min(1).required(),
  date: Joi.date().required(),
  timeSlot: Joi.string().required(),
  notes: Joi.string().allow("", null).optional(),
});
const labReqsultSchema = Joi.object({
  labResult: Joi.string().uri().optional(),
});

module.exports = {
  labRequestSchema,
  labReqsultSchema,
};
