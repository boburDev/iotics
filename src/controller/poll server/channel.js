const { RequestBody, RequestData, RequestParams } = require("../../config/welcomers/request")
const { ResponseError, Response } = require("../../config/welcomers/response")
const { channelType, channelTCPCategory, channelCOMCategory, channelGSMCategory } = require("../../global/enum")
const { channelCreateComValidate, channelCreateTCPClientValidate, channelCreateTCPServerValidate,
    channelCreateTCPPeerToPeerValidate, channelCreateGSMValidate } = require("../../validation/poll server/channel-create")
const { connect } = require("../../service")
const { channelUpdateComValidate, channelUpdateTCPClientValidate, channelUpdateTCPServerValidate, channelUpdateTCPPeerToPeerValidate, channelUpdateGSMValidate } = require("../../validation/poll server/channel-update")

module.exports.createChannel = async (...args) => {
    try {
        const { channel_type, channel_category } = RequestData(args, "channel_type", "channel_category")
        let body

        if (channel_type == channelType[0]) {
            switch (channel_category) {
                case channelCOMCategory[0]:
                    body = RequestBody(args, channelCreateComValidate)
                    break;
                default:
                    return ResponseError(args, { channel_category, channelType, channel_type }, "0.036.003")
            }

        } else if (channel_type == channelType[1]) {
            switch (channel_category) {
                case channelTCPCategory[0]:
                    body = RequestBody(args, channelCreateTCPClientValidate)
                    break;
                case channelTCPCategory[1]:
                    body = RequestBody(args, channelCreateTCPServerValidate)
                    break;
                case channelTCPCategory[2]:
                    body = RequestBody(args, channelCreateTCPPeerToPeerValidate)
                    break;
                default:
                    return ResponseError(args, { channel_category, channelType, channel_type }, "0.036.003")
            }

        } else if (channel_type == channelType[2]) {
            switch (channel_category) {
                case channelGSMCategory[0]:
                    body = RequestBody(args, channelCreateGSMValidate)
                    break;
                default:
                    return ResponseError(args, { channel_category, channelType, channel_type }, "0.036.003")
            }

        } else {
            return ResponseError(args, { channel_type, channelType }, "0.036.001")
        }

        if (body) {
            await connect.channel.create("0.036.002", body)
            return Response(args, "Successful Created", 201)
        } else {
            return ResponseError(args, { channel_category, channelType, channel_type, body }, "0.036.004")
        }
    } catch (error) {
        return ResponseError(args, error, "0.036.000")
    }
}

module.exports.listChannel = async (...args) => {
    try {
        const list = await connect.channel.find("0.037.002")

        return Response(args, list)
    } catch (error) {
        return ResponseError(args, error, "0.037.000")
    }
}

module.exports.oneChannel = async (...args) => {
    try {
        const { id } = RequestParams(args)
        const find = await connect.channel.findById("0.037.001", "0.037.002", id)

        return Response(args, find)
    } catch (error) {
        return ResponseError(args, error, "0.038.000")
    }
}

module.exports.updateChannel = async (...args) => {
    try {
        const { id } = RequestParams(args)
        const { channel_type, channel_category } = RequestData(args, "channel_type", "channel_category")
        let body

        const find = await connect.channel.findOne("0.040.002", id)
        if (!find) { return ResponseError(args, { channel_category, channel_type, id }, "0.040.001") }

        if (channel_type == channelType[0]) {
            switch (channel_category) {
                case channelCOMCategory[0]:
                    body = RequestBody(args, channelUpdateComValidate)
                    break;
                default:
                    return ResponseError(args, { channel_category, channelType, channel_type }, "0.040.003")
            }

        } else if (channel_type == channelType[1]) {
            switch (channel_category) {
                case channelTCPCategory[0]:
                    body = RequestBody(args, channelUpdateTCPClientValidate)
                    break;
                case channelTCPCategory[1]:
                    body = RequestBody(args, channelUpdateTCPServerValidate)
                    break;
                case channelTCPCategory[2]:
                    body = RequestBody(args, channelUpdateTCPPeerToPeerValidate)
                    break;
                default:
                    return ResponseError(args, { channel_category, channelType, channel_type }, "0.040.003")
            }

        } else if (channel_type == channelType[2]) {
            switch (channel_category) {
                case channelGSMCategory[0]:
                    body = RequestBody(args, channelUpdateGSMValidate)
                    break;
                default:
                    return ResponseError(args, { channel_category, channelType, channel_type }, "0.040.003")
            }

        } else {
            return ResponseError(args, { channel_type, channelType }, "0.040.004")
        }

        if (body) {
            await connect.channel.update("0.040.006", find, body)
            return Response(args, "Successful Updated", 201)
        } else {
            return ResponseError(args, { channel_category, channelType, channel_type, body }, "0.040.005")
        }
    } catch (error) {
        return ResponseError(args, error, "0.040.000")
    }
}

module.exports.deleteChannel = async (...args) => {
    try {
        const { id } = RequestParams(args)

        const find = await connect.channel.findOne("0.041.001", id)
        if (!find) { return ResponseError(args, { find, id }, "0.041.001") }

        await connect.channel.delete("0.041.002", id)
        return Response(args, "Successful Deleted", 204)
    } catch (error) {
        return ResponseError(args, error, "0.041.000")
    }
}
