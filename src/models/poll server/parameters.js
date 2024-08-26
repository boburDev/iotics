const mongoose = require("mongoose")

const parameterSchema = new mongoose.Schema({
    meter_id: { type: mongoose.Schema.Types.ObjectId, ref: "meter" },
    current: [{
        indicator: String,
        param_code: String,
        short_name: String,
    }],
    billing: [{
        indicator: String,
        param_code: String,
        short_name: String,
    }],
    archive: [{
        indicator: String,
        param_code: String,
        short_name: String,
    }],
    event: [{
        indicator: String,
        param_code: String,
        short_name: String,
    }],
})

module.exports.parameterModel = mongoose.model("parameter", parameterSchema)
