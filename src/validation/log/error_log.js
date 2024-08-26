const Joi = require("joi");

module.exports.errorCreateValidate = (args) => {
    const schema = Joi.object({
        error_code: Joi.string().allow(''),
        error_operation: Joi.string().allow(''),
        error_message: Joi.string().allow(''),
        error_body: Joi.string().allow(''),
        code_for_user: Joi.string().allow(''),
        recommendations: Joi.string().allow(''),
        error_description: Joi.string().allow('')
    }).required();

    const { error, value } = schema.validate(args)

    if (error) { return { status: false, error } }
    return { status: true, value }
}
