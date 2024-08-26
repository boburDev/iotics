const Joi = require("joi");

module.exports.copyCreateValidate = Joi.object().keys({
    day: Joi.number(),
    location: Joi.string(),
    last_copied_day: Joi.string(),
    active: Joi.boolean(),
}).required()
