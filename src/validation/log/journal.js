const Joi = require("joi");

module.exports.journalStatisticsValidate = Joi.object().keys({
    date: Joi.string().required(),
}).required()

module.exports.journalListValidate = Joi.object().keys({
    date: Joi.string().required(),
    type: Joi.string(),
    result: Joi.string(),
    limit: Joi.number(),
    page: Joi.number(),
    time: Joi.number(),
}).required()
