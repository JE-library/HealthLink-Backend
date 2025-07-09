const Joi = require("joi");

const paymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().default("USD"),
  paymentMethod: Joi.string()
    .valid("card", "paypal", "wallet", "other")
    .required(),
  relatedAppointment: Joi.string().required(),
});

module.exports = {
  paymentSchema,
};
