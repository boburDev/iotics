const { default: mongoose } = require("mongoose")
const CustomError = require("../../errors/custom_error")
const { uspdModel, meterModel } = require("../../models")

module.exports = {
    create: async (code, args) => {
        try {
            return await uspdModel.create(args)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    find: async (code) => {
        try {
            return await uspdModel.find()
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    findOne: async (code, args) => {
        try {
            return await uspdModel.findOne(args)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    findById: async (code, id) => {
        try {
            return await uspdModel.findById(id)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    findWithChannel: async (code, channel_id) => {
        try {
            return await uspdModel.aggregate([
                {
                    $match: { channel_id: new mongoose.Types.ObjectId(channel_id) }
                },
                {
                    $lookup: {
                        from: "meters",
                        localField: "_id",
                        foreignField: "uspd_id",
                        as: "meters"
                    }
                },
                {
                    $unwind: {
                        path: "$meters",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "parameters",
                        localField: "meters._id",
                        foreignField: "meter_id",
                        as: "meters.parameters"
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        channel_id: { $first: "$channel_id" },
                        uspd_model: { $first: "$uspd_model" },
                        connection_address: { $first: "$connection_address" },
                        time_difference: { $first: "$time_difference" },
                        protocol: { $first: "$protocol" },
                        createdAt: { $first: "$createdAt" },
                        updatedAt: { $first: "$updatedAt" },
                        meters: { $push: "$meters" }
                    }
                }
            ]);
            
        } catch (error) {
            throw new CustomError({ channel_id, error: error.message }, code)
        }
    },
    update: async (code, _id, args) => {
        try {
            return await uspdModel.updateOne({ _id }, args)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    remove: async (code, _id) => {
        try {
            await uspdModel.deleteOne({ _id })
                .then(async () => await meterModel.updateMany({ uspd_id: _id }, { $unset: { channel_id: null, uspd_id: null } }))

        } catch (error) {
            throw new CustomError(error, code)
        }
    },
}