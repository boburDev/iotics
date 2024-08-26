const { RequestData, RequestBody, RequestToken, RequestParams } = require("../../config/welcomers/request")
const { Response, ResponseError } = require("../../config/welcomers/response")
const { newObject } = require("../../func/helper_function")
const { protocolUSPDEnum } = require("../../global/enum")
const { connect } = require("../../service")
const { createUSPDHttpValidate, createUSPDModbusValidate, updateUSPDHttpValidate, updateUSPDModbusValidate } = require("../../validation/poll server/uspd")

module.exports.createUSPD = async (...args) => {
    try {
        const { protocol } = RequestData(args, 'protocol')
        const { role, admin, session } = RequestToken(args)

        let id
        if (protocol == protocolUSPDEnum[2]) {
            const body = RequestBody(args, createUSPDHttpValidate)
            await connect.uspd.create("0.046.001", body)
                .then(async (uspd) => { await connect.history.create({ message: "USPD qoshildi", admin, session, role, id: uspd._id }); id = uspd._id })
        } else {
            const body = RequestBody(args, createUSPDModbusValidate)
            await connect.uspd.create("0.046.002", body)
                .then(async (uspd) => { await connect.history.create({ message: "USPD qoshildi", admin, session, role, id: uspd._id }); id = uspd._id })
        }

        return Response(args, { message: "Successful Created", newUSPD: id }, 201)
    } catch (error) {
        return ResponseError(args, error, "0.046.000")
    }
}

module.exports.listUSPD = async (...args) => {
    try {
        const find = await connect.uspd.find("0.047.001")
        return Response(args, find)
    } catch (error) {
        return ResponseError(args, error, "0.047.000")
    }
}

module.exports.oneUSPD = async (...args) => {
    try {
        const { id } = RequestParams(args)

        const find = newObject(await connect.uspd.findById("0.048.001", id))
        if (!find) { return ResponseError(args, { find, id }, "0.048.002") }

        find.meters_count = await connect.meter.findCount("0.048.003", { uspd_id: find._id })
        return Response(args, find)
    } catch (error) {
        return ResponseError(args, error, "0.048.000")
    }
}

module.exports.updateUSPD = async (...args) => {
    try {
        const { role, admin, session } = RequestToken(args)
        const { id } = RequestParams(args)

        const find = await connect.uspd.findById("0.049.001", id)
        if (!find) { return ResponseError(args, { find, id }, "0.049.002") } 

        if (find.protocol == protocolUSPDEnum[2]) {
            const body = RequestBody(args, updateUSPDHttpValidate)
            await connect.uspd.update("0.049.003", id, body)
                .then(async (uspd) => { await connect.history.create({ message: "USPD o'zgardi", admin, session, role, id: uspd._id }) })

        } else {
            const body = RequestBody(args, updateUSPDModbusValidate)
            await connect.uspd.update("0.049.004", id, body)
                .then(async (uspd) => { await connect.history.create({ message: "USPD o'zgardi", admin, session, role, id: uspd._id }) })

        }

        return Response(args, "Successful Updated")
    } catch (error) {
        console.log(error)
        return ResponseError(args, error, "0.049.000")
    }
}

module.exports.removeUSPD = async (...args) => {
    try {
        const { id } = RequestParams(args)

        const find = newObject(await connect.uspd.findById("0.050.001", id))
        if (!find) { return ResponseError(args, { find, id }, "0.050.002") }

        await connect.uspd.remove("0.050.003", id)
        return Response(args, "Successful Removed", 204)
    } catch (error) {
        return ResponseError(args, error, "0.050.000")
    }
}