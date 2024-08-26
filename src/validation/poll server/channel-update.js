const Joi = require("joi");
const { channelType, channelCOMCategory, channelStopBitEnum, channelDataBitEnum, channelParityEnum, channelTCPCategory, channelGSMCategory } = require("../../global/enum");

module.exports.channelUpdateComValidate = Joi.object().keys({
    channel_type: Joi.string().valid(...channelType),
    channel_category: Joi.string().valid(...channelCOMCategory),
    stop_bit: Joi.string().valid(...channelStopBitEnum),
    data_bit: Joi.string().valid(...channelDataBitEnum),
    parity: Joi.string().valid(...channelParityEnum),
    interbyte_interval: Joi.number(),
    resend_count: Joi.number(),
    waiting_time: Joi.number(),
    pause_time: Joi.number(),
    baud_rate: Joi.string(),
    comport: Joi.string(),
}).required()

module.exports.channelUpdateTCPClientValidate = Joi.object().keys({
    channel_type: Joi.string().valid(...channelType),
    channel_category: Joi.string().valid(channelTCPCategory[0]),
    interbyte_interval: Joi.number(),
    resend_count: Joi.number(),
    waiting_time: Joi.number(),
    pause_time: Joi.number(),
    ip_address: Joi.string(),
    port: Joi.string(),
}).required()

module.exports.channelUpdateTCPServerValidate = Joi.object().keys({
    channel_type: Joi.string().valid(...channelType),
    channel_category: Joi.string().valid(channelTCPCategory[1]),
    interbyte_interval: Joi.number(),
    resend_count: Joi.number(),
    waiting_time: Joi.number(),
    pause_time: Joi.number(),
    port: Joi.string(),
}).required()

module.exports.channelUpdateTCPPeerToPeerValidate = Joi.object().keys({
    channel_type: Joi.string().valid(...channelType),
    channel_category: Joi.string().valid(channelTCPCategory[2]),
    interbyte_interval: Joi.number(),
    resend_count: Joi.number(),
    waiting_time: Joi.number(),
    pause_time: Joi.number(),
    ip_address: Joi.string(),
}).required()

module.exports.channelUpdateGSMValidate = Joi.object().keys({
    channel_type: Joi.string().valid(...channelType),
    channel_category: Joi.string().valid(...channelGSMCategory),
    stop_bit: Joi.string().valid(...channelStopBitEnum),
    data_bit: Joi.string().valid(...channelDataBitEnum),
    parity: Joi.string().valid(...channelParityEnum),
    interbyte_interval: Joi.number(),
    resend_count: Joi.number(),
    waiting_time: Joi.number(),
    pause_time: Joi.number(),
    baud_rate: Joi.string(),
    comport: Joi.string(),
    modem_command: Joi.string(),
    modem_phone: Joi.string(),
}).required()
