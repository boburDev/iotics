const { default: mongoose } = require("mongoose")
const CustomError = require("../../errors/custom_error")
const { meterModel } = require("../../models")

module.exports = {
    create: async (code, args) => {
        try {
            return await meterModel.create(args)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    findOne: async (code, args) => {
        try {
            const find = await meterModel.findOne(args)
            if (!find) return
            if (!find.status) return

            return find
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    findWithNumberMeter: async (code, number_meter) => {
        try {
            return await meterModel.findOne({ number_meter })
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    findOnlyMeter: async (code, channel_id) => {
        try {
            return await meterModel.aggregate([
                {
                    $match: {
                        channel_id: new mongoose.Types.ObjectId(channel_id),
                        status: true,
                        uspd_id: null
                    }
                },
                {
                    $lookup: {
                        from: "parameters",
                        localField: "_id",
                        foreignField: "meter_id",
                        as: "parameters"
                    }
                }
            ])
        } catch (error) {
            throw new CustomError({ channel_id, error: error.message }, code)
        }
    },
    findCount: async (code, args) => {
        try {
            return await meterModel.countDocuments(args)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    findById: async (code1, code2, id) => {
        try {
            const find = await meterModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: 'parameters',
                        localField: '_id',
                        foreignField: 'meter_id',
                        as: 'parameters'
                    }
                }
            ])
            if (!find[0] || !find[0].status) { throw new CustomError({ id }, code2) }
            return find[0]
        } catch (error) {
            throw new CustomError(error, code1)
        }
    },
    update: async (code, _id, args) => {
        try {
            return await meterModel.updateOne({ _id }, args)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
}