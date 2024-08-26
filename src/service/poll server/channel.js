const mongoose = require("mongoose")
const CustomError = require("../../errors/custom_error")
const { channelModel, meterModel, uspdModel } = require("../../models")
const { newObject } = require("../../func/helper_function")

module.exports = {
    create: async (code, args) => {
        try {
            return await channelModel.create(args)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    find: async (code) => {
        try {
            return await channelModel.find()
        } catch (error) {
            throw new CustomError(error, "0.037.001")
        }
    },
    findOne: async (code, id) => {
        try {
            return await channelModel.findById(id)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    findById: async (code1, code2, id) => {
        try {
            const find = await channelModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: 'meters',
                        localField: '_id',
                        foreignField: 'channel_id',
                        as: 'meters'
                    }
                }
            ])
            if (!find[0]) { throw new CustomError(error, code2) }

            const connection = newObject(find[0])
            const meters = []

            for (const meter of connection.meters) {
                if (meter.status) {
                    meters.push(meter)
                }
            }
            delete connection.meters
            connection.meters = meters
            return connection
        } catch (error) {
            throw new CustomError(error, code1)
        }
    },
    update: async (code, obj, args) => {
        try {
            const find = newObject(obj)
            const _id = find._id
            delete find._id
            delete find.createdAt
            delete find.updatedAt

            for (const key in find) {
                await channelModel.updateOne({ _id }, { $unset: { [key]: "" } },)
            }

            await channelModel.updateOne({ _id }, { $set: args },)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    delete: async (code, _id) => {
        try {
            await meterModel.updateMany({ channel_id: _id }, { $unset: { channel_id: "" } })
            await uspdModel.updateMany({ channel_id: _id }, { $unset: { channel_id: "" } })
            return await channelModel.deleteOne({ _id })
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
}