const CustomError = require("../../errors/custom_error")
const { schemaModel } = require("../../models")

module.exports = {
    create: async (code, args) => {
        try {
            return await schemaModel.create(args)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    find: async (code) => {
        try {
            return await schemaModel.find()
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    findOne: async (code, args) => {
        try {
            return await schemaModel.findOne(args)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    findById: async (code, id) => {
        try {
            return await schemaModel.findById(id)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    update: async (code, _id, args) => {
        try {
            return await schemaModel.updateOne({ _id }, args)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    remove: async (code, _id, args) => {
        try {
            return await schemaModel.deleteOne({ _id }, args)
        } catch (error) {
            throw new CustomError(error, code)
        }
    }
}
