const Joi = require("joi");
const { protocolUSPDEnum } = require("../../global/enum");
const { enumUspdModels } = require("../../global/type_enum");

module.exports.createUSPDModbusValidate = Joi.object().keys({
    connection_address: Joi.string().required(),
    uspd_model: Joi.string().valid(...enumUspdModels).required(),
    time_difference: Joi.number().required(),
    channel_id: Joi.string().required(),
    protocol: Joi.string().valid(protocolUSPDEnum[0], protocolUSPDEnum[1]).required(),
}).required()


module.exports.createUSPDHttpValidate = Joi.object().keys({
    login: Joi.string().required(),
    password: Joi.string().required(),
    uspd_model: Joi.string().valid(...enumUspdModels).required(),
    time_difference: Joi.number().required(),
    channel_id: Joi.string().required(),
    protocol: Joi.string().valid(protocolUSPDEnum[2]).required()
}).required()

module.exports.updateUSPDModbusValidate = Joi.object().keys({
    connection_address: Joi.string(),
    time_difference: Joi.number(),
    channel_id: Joi.string(),
}).required()


module.exports.updateUSPDHttpValidate = Joi.object().keys({
    login: Joi.string(),
    password: Joi.string(),
    time_difference: Joi.number(),
    channel_id: Joi.string(),
}).required()