const { RequestBody, RequestToken, RequestParams, RequestData } = require("../../config/welcomers/request")
const { Response, ResponseError } = require("../../config/welcomers/response")
const { modelList } = require("../../global/file_path")
const { categorizeData } = require("../../server/utils/obis")
const { connect } = require("../../service")
const { meterCreateValidate, meterUpdateValidate, meterCreateUSPDValidate, meterUpdateUSPDValidate } = require("../../validation/poll server/meter")

module.exports.createMeter = async (...args) => {
    try {
        const { role, admin, session } = RequestToken(args)
        const { key, meter_model, meter_type } = RequestData(args, 'key', 'meter_model', 'meter_type')
        let newMeter
        let body

        const parameters = categorizeData({ DeviceType: "meter", DeviceModel: meter_model }) // BUG meter emas meter_type qoyish kere
        if (key == 'uspd') {
            body = RequestBody(args, meterCreateUSPDValidate)
            const event = []
            const current = body.parameters
            const billing = parameters.billing.map(e => ({ short_name: e.obis.name, param_code: e.obis.obis }))
            const archive = parameters.archive.map(e => ({ short_name: e.obis.name, param_code: e.obis.obis }))

            body.parameters = { current, billing, archive, event }
        } else {
            body = RequestBody(args, meterCreateValidate)
            const current = []
            const event = []
            parameters.current.map(e => {
                if (Array.isArray(e.obis)) {
                    e.obis.map(({ name, obis }) => {
                        current.push({ short_name: name, param_code: obis })
                    })
                }
            }) // BUG bir line qilishga urinib kor
            const billing = parameters.billing.map(e => ({ short_name: e.obis.name, param_code: e.obis.obis }))
            const archive = parameters.archive.map(e => ({ short_name: e.obis.name, param_code: e.obis.obis }))

            body.parameters = { current, billing, archive, event }
        }

        const findDatabase = await connect.meter.findWithNumberMeter("0.042.001", body.number_meter)
        if (findDatabase) {
            if (findDatabase.status) {
                return ResponseError(args, { message: "Bunday shotchik bor va u ishlamoqda" }, "0.042.004")
            }

            if (!body.warning || findDatabase.meter_model != body.meter_model || body.meter_type != findDatabase.meter_type) {
                return ResponseError(args, { message: "Bunday shotchik bor va u reactive. Lekin qoshilayotgan meter model boshqacha" }, "0.042.007")
            }

            const meter_id = findDatabase._id
            newMeter = meter_id
            await connect.meter.update("0.042.005", meter_id, {...body, status: true})
                .then(async () => { await connect.parameters.update("0.042.006", meter_id, {...body.parameters, meter_id}) })
                .then(async () => await connect.history.create({ role, message: `${meter_id} meter create routdan o'zgartirildi`, meter_id, admin, session }))
        } else {
            await connect.meter.create("0.042.002", body)
                .then(async (data) => { newMeter = data._id; await connect.parameters.create("0.042.003", { ...body.parameters, meter_id: data._id }); return data })
                .then(async (data) => await connect.history.create({ role, message: "Yengi meter qoshildi", id: data._id, admin, session }))
        }

        return Response(args, { message: "Successful Created", newMeter }, 201)
    } catch (error) {
        console.log(error)
        return ResponseError(args, error, "0.042.000")
    }
}

module.exports.modelList = async (...args) => {
    try {
        return Response(args, modelList)
    } catch (error) {
        return ResponseError(args, error, "0.054.000")
    }
}

module.exports.oneMeter = async (...args) => {
    try {
        const { id } = RequestParams(args)

        const find = await connect.meter.findById("0.043.001", "0.043.002", id)
        return Response(args, find)
    } catch (error) {
        return ResponseError(args, error, "0.043.000")
    }
}

module.exports.updateMeter = async (...args) => {
    try {
        const { id } = RequestParams(args)
        const { role, admin, session } = RequestToken(args)
        const { key, meter_model } = RequestData(args, 'key', 'meter_model')
        let body

        const parameters = categorizeData({ DeviceType: "meter", DeviceModel: meter_model }) // BUG meter emas meter_type qoyish kere
        if (key == 'uspd') {
            body = RequestBody(args, meterUpdateUSPDValidate)
            const event = []
            const current = body.parameters
            const billing = parameters.billing.map(e => ({ short_name: e.obis.name, param_code: e.obis.obis }))
            const archive = parameters.archive.map(e => ({ short_name: e.obis.name, param_code: e.obis.obis }))

            body.parameters = { current, billing, archive, event }
        } else {
            body = RequestBody(args, meterUpdateValidate)
            const current = []
            const event = []
            parameters.current.map(e => {
                if (Array.isArray(e.obis)) {
                    e.obis.map(({ name, obis }) => {
                        current.push({ short_name: name, param_code: obis })
                    })
                }
            }) // BUG bir line qilishga urinib kor
            const billing = parameters.billing.map(e => ({ short_name: e.obis.name, param_code: e.obis.obis }))
            const archive = parameters.archive.map(e => ({ short_name: e.obis.name, param_code: e.obis.obis }))

            body.parameters = { current, billing, archive, event }
        }

        const find = await connect.meter.findOne("0.044.004", { _id: id })
        if (!find) { return ResponseError(args, { find, id }, "0.044.001") }

        await connect.meter.update("0.044.002", id, body)
            .then(async () => { await connect.parameters.update("0.044.003", id, body.parameters) })
            .then(async () => await connect.history.create({ role, message: `${id} meter o'zgartirildi`, id, admin, session }))

        return Response(args, "Successful Updated")
    } catch (error) {
        return ResponseError(args, error, "0.044.000")
    }
}

module.exports.removeMeter = async (...args) => {
    try {
        const { id } = RequestParams(args)
        const { role, admin, session } = RequestToken(args)

        const find = await connect.meter.findOne("0.045.002", { _id: id })
        if (!find) { return ResponseError(args, { find, id }, "0.045.001") }

        await connect.meter.update("0.045.003", id, { status: false })
            .then(async () => await connect.history.create({ role, message: `${id} meter o'chirdi`, id, admin, session }))

        return Response(args, "Successful Removed", 204)
    } catch (error) {
        return ResponseError(args, error, "0.045.000")
    }
}