const Joi = require("joi");
const { notificationCategory, notificationType } = require("../../global/enum");

module.exports.notificationAllValidate = Joi.object().keys({
    limit: Joi.number(),
    last_id: Joi.string(),
    date: Joi.string(),
    category: Joi.string().valid(...notificationCategory),
    source: Joi.string().valid(...notificationType)
}).required()

module.exports.notificationUpdateValidate = Joi.object().keys({
    can: Joi.string().valid("add", "remove").required(),
    array: Joi.array().required()
}).required()
