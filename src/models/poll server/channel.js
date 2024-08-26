const mongoose = require("mongoose")
const { channelType, channelParityEnum, channelStopBitEnum, channelDataBitEnum, channelCategory } = require("../../global/enum")

const channelSchema = new mongoose.Schema({
    channel_type: { type: String, enum: channelType },
    channel_category: { type: String, enum: channelCategory },
    interbyte_interval: { type: Number },
    resend_count: { type: Number },
    waiting_time: { type: Number },
    pause_time: { type: Number },
    stop_bit: { type: Number, enum: channelStopBitEnum },
    data_bit: { type: Number, enum: channelDataBitEnum },
    parity: { type: String, enum: channelParityEnum },
    modem_command: { type: String },
    modem_phone: { type: String },
    ip_address: String,
    baud_rate: String,
    comport: String,
    port: String
}, {
    timestamps: true
})

module.exports.channelModel = mongoose.model("channel", channelSchema)