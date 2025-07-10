const Joi = require("joi");

const updateNotificationStatusSchema = Joi.object({
  read: Joi.boolean().required(),
});

module.exports = { updateNotificationStatusSchema };
