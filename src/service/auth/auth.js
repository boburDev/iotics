const CustomError = require("../../errors/custom_error")
const { adminModel } = require("../../models")
const { passwordValidate } = require("../../utils/password")

module.exports = {
    async checkAuth(login, password) {
        try {
            const find = await adminModel.findOne({ login })

            if (!find) {
                throw new CustomError({ login }, "0.005.001")
            }

            if (!find.active) {
                throw new CustomError({ login, find }, "0.005.007")
            }

            if (!passwordValidate(password, find.password)) {
                throw new CustomError({ password, hash: find.password }, "0.005.002")
            }

            return {
                role: find.role,
                name: find.name,
                _id: find._id
            }
        } catch (error) {
            throw new CustomError(error, "0.005.003")
        }
    },
    async checkLogin(login) {
        try {
            const find = await adminModel.findOne({ login })

            if (!find || !find.active) {
                throw new CustomError({ login, find }, "0.007.001")
            }

            return find
        } catch (error) {
            throw new CustomError(error, "0.007.002")
        }
    },
    async update(_id, args) {
        try {
            return await adminModel.updateOne({ _id }, args)
        } catch (error) {
            throw new CustomError({ _id, args, error }, "0.007.003")
        }
    }
}