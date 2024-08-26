const mongoose = require("mongoose")
const { protocolUSPDEnum } = require("../../global/enum")
const { enumUspdModels } = require("../../global/type_enum")

const uspdSchema = new mongoose.Schema({
    login: String,
    password: String,
    connection_address: String,
    time_difference: Number,
    uspd_model: { type: String, enum: enumUspdModels, require: true },
    channel_id: { type: mongoose.Schema.Types.ObjectId, ref: "channel", require: true },
    protocol: { type: String, enum: protocolUSPDEnum, require: true },
}, {
    timestamps: true
})

module.exports.uspdModel = mongoose.model("uspd", uspdSchema)