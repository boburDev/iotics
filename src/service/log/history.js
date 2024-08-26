const CustomError = require("../../errors/custom_error")
const { historyModel } = require("../../models")

module.exports = {
    async create({ role, message, id, admin, session }) {
        try {
            await historyModel.create({ message, role, added_id: id, admin, session })
        } catch (error) {
            throw new CustomError({
                role, id, admin, session,
                error: error.message
            }, "0.024.000")
        }
    }
}