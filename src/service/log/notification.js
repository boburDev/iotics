const { default: mongoose } = require('mongoose')
const CustomError = require('../../errors/custom_error')
const notification = require('../../jsons/notification.json')
const { adminModel } = require('../../models')
const { notificationModel } = require('../../models/log/notification')
const { distributorSocket } = require('../../web')
const { notificationMessages } = require('../../global/file_path')
const { newObject } = require('../../func/helper_function')

module.exports = {
    async create(error_code, code) {
        try {
            const find = notification[code]
            if (!find) {
                throw new CustomError({ code }, "0.025.001")
            }

            const create = await notificationModel.create({ code })
            for (const role of find.who_for) {
                await adminModel.updateMany(
                    { role, notification_type: { $in: find.type } },
                    { $push: { notification: create._id } }
                );

                distributorSocket(create._id, role, find)
            }

        } catch (error) {
            throw new CustomError(error, error_code)
        }
    },
    async findById(code, id) {
        try {
            return await notificationModel.findById(id)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    async findAll(code, limit, last_id, date, category, source, role, result=[]) {
        try {
            const arr = [{ $limit: limit }]

            if (last_id) { arr.unshift({ $match: { _id: { $gt: new mongoose.Types.ObjectId(last_id) } } }) }
            if (date) { arr.unshift({ $match: { createdAt: {$gt: date} } }) }

            const find = await notificationModel.aggregate(arr)

            for (const value of find) {
                const findCode = newObject(notificationMessages[value.code])
                if (!findCode) continue

                if (category && findCode.category != category) continue
                if (source && findCode.source != source) continue
                if (role && !findCode.who_for.includes(role)) continue

                delete findCode.who_for
                result.push({ ...value, ...findCode })
            }

            if (find.length == limit && result.length < limit) { await this.findAll(code, limit, last_id, result.at(-1).createdAt, category, source, role, result) }
            return result.slice(0, limit)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
}