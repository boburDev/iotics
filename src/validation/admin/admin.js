const Joi = require("joi")
const { adminRolesList } = require("../../global/enum")

module.exports.adminCreateValidate = Joi.object().keys({
    name: Joi.string().required(),
    login: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid(adminRolesList[1], adminRolesList[2], adminRolesList[3]).required(),
}).required()

module.exports.adminCreateAdminValidate = Joi.object().keys({
    login: Joi.string().required(),
    password: Joi.string().required(),
    key: Joi.string().required()
}).required()

module.exports.adminUpdateValidate = Joi.object().keys({
    name: Joi.string(),
    login: Joi.string(),
    password: Joi.string(),
    block: Joi.string(),
    forgot_password: Joi.string(),
    notification_type: Joi.array(),
    role: Joi.string().valid(...adminRolesList),
}).required()

module.exports.profileUpdateValidate = Joi.object().keys({
    name: Joi.string(),
    login: Joi.string(),
    password: Joi.string(),
    block: Joi.string(),
    notification_mute: Joi.array(),
}).required()