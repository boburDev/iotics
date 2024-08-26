const Joi = require("joi");

module.exports.folderUpdateValidate = Joi.object().keys({
    folder : Joi.string(),
    elect : Joi.string(),
    calc : Joi.string(),
}).required()

module.exports.folderStatisticValidate = Joi.object().keys({
    link : Joi.string(),
}).required()
