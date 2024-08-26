const CustomError = require("../../errors/custom_error")
const { journalModel } = require("../../models")

module.exports = {
    async create(code, args) {
        try {
            return await journalModel.create(args)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    async findOne(code, device_id, today) {
        try {
            return await journalModel.findOne({ device_id, date: today })
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    async update(code, _id, args) {
        try {
            return await journalModel.updateOne({ _id }, args)
        } catch (error) {
            throw new CustomError(error, code)
        }
    }
}