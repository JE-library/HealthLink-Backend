const Joi = require("joi");

const labRequestSchema = Joi.object({
  tests: Joi.array().items(Joi.string().min(1)).min(1).required(), // e.g. ["blood test", "MRI"]
  ServiceProvider: Joi.string().required(),
});

module.exports = {
  labRequestSchema,
};
