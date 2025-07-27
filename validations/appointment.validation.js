const Joi = require("joi");

const appointmentSchema = Joi.object({
  date: Joi.date().required(),
  timeSlot: Joi.string().required(), // e.g. "10:00-10:30"
  mode: Joi.string()
    .valid("video", "chat", "audio", "in-person")
    .default("chat"),
  notes: Joi.string().allow("", null).optional(),
});

const messageSchema = Joi.object({
  message: Joi.string().required(), 
});


module.exports = {
  appointmentSchema,messageSchema
};
