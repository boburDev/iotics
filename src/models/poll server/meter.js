const mongoose = require("mongoose")
const { periodTypeEnum } = require("../../global/enum")
const { enumMeterTypes } = require("../../global/type_enum")
const { modelList } = require("../../global/file_path")

const meterSchema = new mongoose.Schema({
    password: String,
    protokol: String,
    get_billing: Boolean,
    get_archive: Boolean,
    get_current: Boolean,
    get_event: Boolean,
    connection_address: String,
    time_difference: Number,
    days_of_month: [Number],
    days_of_week: [Number],
    number_meter: { type: String, unique: true },
    status: { type: Boolean, default: true },
    period_type: { type: String, enum: periodTypeEnum },
    hours_of_day: { type: [{ hour: Number, minutes: [Number] }], default: [] },
    channel_id: { type: mongoose.Schema.Types.ObjectId, ref: "connection", default: null },
    uspd_id: { type: mongoose.Schema.Types.ObjectId, ref: "uspd", default: null },
    meter_model: { type: String, enum: modelList, require: true },
    meter_type: { type: String, enum: enumMeterTypes, require: true },

}, {
    timestamps: true
})

module.exports.meterModel = mongoose.model("meter", meterSchema)
