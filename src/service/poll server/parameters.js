const CustomError = require("../../errors/custom_error")
const { newObject } = require("../../func/helper_function")
const { parameterModel } = require("../../models")

module.exports = {
    create: async (code, args) => {
        try {
            return await parameterModel.create(args)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    update: async (code, meter_id, parameters) => {
        try {
            await parameterModel.updateOne({ meter_id }, parameters)
        } catch (error) {
            throw new CustomError(error, code)
        }
    }
}