const CustomError = require("../../errors/custom_error")
const { newObject } = require("../../func/helper_function")
const { folderModel, channelModel, meterModel, uspdModel } = require("../../models")

module.exports = {
    create: async (code, args) => {
        try {
            await folderModel.create(args)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    find: async (code) => {
        try {
            return (await folderModel.find())[0]
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    fullList: async (code) => {
        try {
            const channels = newObject(await channelModel.find())
            const meters = newObject(await meterModel.find())
            const uspds = newObject(await uspdModel.find())

            const tree = {}
            const result = { channels: [], meters: [], uspds: [] }

            for (const channel of channels) {
                channel.child_uspds = []
                channel.child_meters = []
                tree[channel._id] = channel
                result.channels.push(channel)
            }

            for (const uspd of uspds) {
                uspd.child_meters = []
                tree[uspd._id] = uspd

                if (tree[uspd.channel_id]) {
                    tree[uspd.channel_id].child_uspds.push(uspd)
                } else {
                    result.uspds.push(uspd)
                }
            }

            for (const meter of meters) {
                const checkChannel = tree[meter.channel_id]
                const checkUspd = tree[meter.uspd_id]

                if(checkChannel && checkUspd) {
                    tree[meter.uspd_id].child_meters.push(meter)
                } else if(checkChannel && !checkUspd) {
                    checkChannel.child_meters.push(meter)
                } else {
                    result.meters.push(meter)
                }
            }

            return result
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    update: async (code, _id, args) => {
        try {
            return await folderModel.updateOne({ _id }, args)
        } catch (error) {
            throw new CustomError(error, code)
        }
    },

    // fullList: async (code) => {
    //     try {
    //         const channels = newObject(await channelModel.find())
    //         const meters = newObject(await meterModel.find())
    //         const uspds = newObject(await uspdModel.find())

    //         const tree = {}

    //         for (const channel of channels) {
    //             tree[channel._id] = channel
    //         }

    //         for (const uspd of uspds) {
    //             if(tree[uspd.channel_id]){
    //                 if(tree[uspd.channel_id].child_uspd) {
    //                     tree[uspd.channel_id].child_uspd[uspd._id] = uspd
    //                 } else {
    //                     tree[uspd.channel_id].child_uspd = {}
    //                     tree[uspd.channel_id].child_uspd[uspd._id] = uspd
    //                 }
    //             }
    //         }

    //         for (const meter of meters) {
    //             const check = tree[meter.channel_id]
    //             if(check) {
    //                 if(check.child_uspd && meter.uspd_id && check.child_uspd[meter.uspd_id]) {
    //                     if(!check.child_uspd[meter.uspd_id].child_meters) {
    //                         check.child_uspd[meter.uspd_id].child_meters = {}
    //                         check.child_uspd[meter.uspd_id].child_meters[meter._id] = meter
    //                     } else {
    //                         check.child_uspd[meter.uspd_id].child_meters[meter._id] = meter
    //                     }
    //                 } else {
    //                     if(!tree[meter.channel_id].child_meters) {
    //                         tree[meter.channel_id].child_meters = {}
    //                         tree[meter.channel_id].child_meters[meter._id] = meter
    //                     } else {
    //                         tree[meter.channel_id].child_meters[meter._id] = meter
    //                     }
    //                 }
    //             }
    //         }

    //         return tree
    //     } catch (error) {
    //         throw new CustomError(error, code)
    //     }
    // },
}