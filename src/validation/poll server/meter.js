const Joi = require("joi");
const { periodTypeEnum } = require("../../global/enum");
const { enumMeterTypes } = require("../../global/type_enum");
const { modelList } = require("../../global/file_path");

module.exports.meterCreateValidate = Joi.object().keys({
    password: Joi.string().required(),
    number_meter: Joi.string().required(),
    time_difference: Joi.number().required(),
    days_of_month: Joi.array().required(),
    connection_address: Joi.string().required(),
    period_type: Joi.string().valid(...periodTypeEnum).required(),
    days_of_week: Joi.array().required(),
    warning: Joi.boolean().required(),
    hours_of_day: Joi.array().items(Joi.object({
        hour: Joi.number().required(),
        minutes: Joi.array().items(Joi.number()).required()
    })).required(),
    channel_id: Joi.string().required(),
    get_billing: Joi.boolean().required(),
    get_archive: Joi.boolean().required(),
    get_current: Joi.boolean().required(),
    get_event: Joi.boolean().required(),
    key: Joi.valid('meter').required(),
    meter_model: Joi.string().valid(...modelList).required(),
    meter_type: Joi.string().valid(...enumMeterTypes).required(),
}).required()

module.exports.meterCreateUSPDValidate = Joi.object().keys({
    password: Joi.string().required(),
    number_meter: Joi.string().required(),
    time_difference: Joi.number().required(),
    days_of_month: Joi.array().required(),
    period_type: Joi.string().valid(...periodTypeEnum).required(),
    days_of_week: Joi.array().required(),
    warning: Joi.boolean().required(),
    hours_of_day: Joi.array().items(Joi.object({
        hour: Joi.number().required(),
        minutes: Joi.array().items(Joi.number()).required()
    })).required(),
    uspd_id: Joi.string().required(),
    channel_id: Joi.string().required(),
    get_billing: Joi.boolean().required(),
    get_archive: Joi.boolean().required(),
    get_current: Joi.boolean().required(),
    get_event: Joi.boolean().required(),
    key: Joi.valid('uspd').required(),
    meter_model: Joi.string().valid(...modelList).required(),
    meter_type: Joi.string().valid(...enumMeterTypes).required(),
    parameters: Joi.array().items(
        Joi.object({
            param_code: Joi.string().required(),
            short_name: Joi.string().required(),
            indicator: Joi.string().required()
        })
    ).required(),
}).required()

module.exports.meterUpdateValidate = Joi.object().keys({
    password: Joi.string(),
    number_meter: Joi.string(),
    time_difference: Joi.number(),
    days_of_month: Joi.array(),
    connection_address: Joi.string(),
    period_type: Joi.string().valid(...periodTypeEnum),
    days_of_week: Joi.array(),
    get_billing: Joi.boolean(),
    get_archive: Joi.boolean(),
    get_current: Joi.boolean(),
    get_event: Joi.boolean(),
    key: Joi.valid('meter').required(),
    hours_of_day: Joi.array().items(Joi.object({
        hour: Joi.number(),
        minutes: Joi.array().items(Joi.number())
    })),
    channel_id: Joi.string(),
    meter_model: Joi.string().valid(...modelList),
    meter_type: Joi.string().valid(...enumMeterTypes),
}).required()

module.exports.meterUpdateUSPDValidate = Joi.object().keys({
    password: Joi.string(),
    number_meter: Joi.string(),
    time_difference: Joi.number(),
    days_of_month: Joi.array(),
    period_type: Joi.string().valid(...periodTypeEnum),
    days_of_week: Joi.array(),
    hours_of_day: Joi.array().items(Joi.object({
        hour: Joi.number(),
        minutes: Joi.array().items(Joi.number())
    })),
    uspd_id: Joi.string(),
    channel_id: Joi.string(),
    get_billing: Joi.boolean(),
    get_archive: Joi.boolean(),
    get_current: Joi.boolean(),
    get_event: Joi.boolean(),
    key: Joi.valid('uspd').required(),
    meter_model: Joi.string().valid(...modelList),
    meter_type: Joi.string().valid(...enumMeterTypes),
    parameters: Joi.array().items(
        Joi.object({
            param_code: Joi.string(),
            short_name: Joi.string(),
            indicator: Joi.string()
        })
    ),
}).required()