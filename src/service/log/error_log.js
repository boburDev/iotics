const CustomError = require("../../errors/custom_error")
const { errorModel } = require("../../models")
const { errorCreateValidate } = require("../../validation/log/error_log")

module.exports = {
    async create(code, args) {
        try {
            const validate = errorCreateValidate(args)
            if (!validate.status) {
                return validate
            }

            const create = await errorModel.create(args)
            return { status: true, create }
        } catch (error) {
            return new CustomError({ ...args, error }, code)
        }
    }
}