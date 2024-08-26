const Joi = require("joi");
const { channelType, channelCOMCategory, channelStopBitEnum, channelDataBitEnum, channelParityEnum, channelTCPCategory, channelGSMCategory } = require("../../global/enum");

module.exports.channelCreateComValidate = Joi.object().keys({
    channel_type: Joi.string().valid(...channelType).required(),
    channel_category: Joi.string().valid(...channelCOMCategory).required(),
    stop_bit: Joi.string().valid(...channelStopBitEnum).required(),
    data_bit: Joi.string().valid(...channelDataBitEnum).required(),
    parity: Joi.string().valid(...channelParityEnum).required(),
    interbyte_interval: Joi.number().required(),
    resend_count: Joi.number().required(),
    waiting_time: Joi.number().required(),
    pause_time: Joi.number().required(),
    baud_rate: Joi.string().required(),
    comport: Joi.string().required(),
}).required()

module.exports.channelCreateTCPClientValidate = Joi.object().keys({
    channel_type: Joi.string().valid(...channelType).required(),
    channel_category: Joi.string().valid(channelTCPCategory[0]).required(),
    interbyte_interval: Joi.number().required(),
    resend_count: Joi.number().required(),
    waiting_time: Joi.number().required(),
    pause_time: Joi.number().required(),
    ip_address: Joi.string().required(),
    port: Joi.string().required(),
}).required()

module.exports.channelCreateTCPServerValidate = Joi.object().keys({
    channel_type: Joi.string().valid(...channelType).required(),
    channel_category: Joi.string().valid(channelTCPCategory[1]).required(),
    interbyte_interval: Joi.number().required(),
    resend_count: Joi.number().required(),
    waiting_time: Joi.number().required(),
    pause_time: Joi.number().required(),
    port: Joi.string().required(),
}).required()

module.exports.channelCreateTCPPeerToPeerValidate = Joi.object().keys({
    channel_type: Joi.string().valid(...channelType).required(),
    channel_category: Joi.string().valid(channelTCPCategory[2]).required(),
    interbyte_interval: Joi.number().required(),
    resend_count: Joi.number().required(),
    waiting_time: Joi.number().required(),
    pause_time: Joi.number().required(),
    ip_address: Joi.string().required(),
}).required()

module.exports.channelCreateGSMValidate = Joi.object().keys({
    channel_type: Joi.string().valid(...channelType).required(),
    channel_category: Joi.string().valid(...channelGSMCategory).required(),
    stop_bit: Joi.string().valid(...channelStopBitEnum).required(),
    data_bit: Joi.string().valid(...channelDataBitEnum).required(),
    parity: Joi.string().valid(...channelParityEnum).required(),
    interbyte_interval: Joi.number().required(),
    resend_count: Joi.number().required(),
    waiting_time: Joi.number().required(),
    pause_time: Joi.number().required(),
    baud_rate: Joi.string().required(),
    comport: Joi.string().required(),
    modem_command: Joi.string().required(),
    modem_phone: Joi.string().required(),
}).required()
