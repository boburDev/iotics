const { RequestParams, RequestToken, RequestQuery, RequestBody } = require("../../config/welcomers/request")
const { Response, ResponseError } = require("../../config/welcomers/response")
const { notificationMessages } = require("../../global/file_path")
const { connect } = require("../../service")
const { notificationAllValidate, notificationUpdateValidate } = require("../../validation/log/notification")

module.exports.getOneNotification = async (...args) => {
    try {
        const { id } = RequestParams(args)
        const { role } = RequestToken(args)

        const find = await connect.notification.findById("0.029.004", id)
        if (!find) { return ResponseError(args, error, "0.029.001") }

        const findCode = notificationMessages[find.code]
        if (!findCode) { return ResponseError(args, error, "0.029.002") }
        if (!findCode.who_for.includes(role)) { return ResponseError(args, error, "0.029.003") }
        delete findCode.who_for

        const data = { ...findCode, ...find._doc }
        return Response(args, data)
    } catch (error) {
        return ResponseError(args, error, "0.029.000")
    }
}

module.exports.getAllNotification = async (...args) => {
    try {
        const { role, admin } = RequestToken(args)
        const { limit, last_id, date, category, source } = RequestQuery(args, notificationAllValidate)

        const findAdmin = await connect.admin.findOne("0.030.002", { _id: admin })
        if (!findAdmin) { return ResponseError(args, { message: "Token invalid", admin }, "0.030.001") }

        const unread = findAdmin.notification
        console.log(unread)
        const list = await connect.notification.findAll("0.030.002", limit || 20, last_id, date, category, source, role)
        return Response(args, { unread, list })
    } catch (error) {
        console.log(error)
        return ResponseError(args, error, "0.030.000")
    }
}

module.exports.updateNotification = async (...args) => {
    try {
        const { admin } = RequestToken(args)
        const { can, array } = RequestBody(args, notificationUpdateValidate)

        if (can == 'add') {
            await connect.admin.update("0.031.002", admin, { $push: { notification: { $each: array.map(item => item) } } })
        } else {
            await connect.admin.update("0.031.003", admin, { $pull: { notification: { $in: array } } })
        }

        return Response(args, "Successful Updated")
    } catch (error) {
        return ResponseError(args, error, "0.031.000")
    }
}