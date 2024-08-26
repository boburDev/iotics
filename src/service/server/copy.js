const CustomError = require("../../errors/custom_error")
const { copyModel } = require("../../models")

module.exports = {
    async find(code) {
        try {
            const list = await copyModel.find()
            if (list.length > 1) {
                list.forEach(async (e) => {
                    if (String(e._id) != String(list[0]._id)) {
                        await copyModel.deleteOne({ _id: e._id })
                    }
                })
            }

            return list[0]
        } catch (error) {
            throw new CustomError(error, code)
        }
    },

    async create(code, args) {
        try {
            return await copyModel.create(args)
        } catch (error) {
            throw new CustomError({ ...args, error }, code)
        }
    },

    async update(code, _id, args) {
        try {
            return await copyModel.updateOne({ _id }, args)
        } catch (error) {
            throw new CustomError({...args, error}, code)
        }
    }
}