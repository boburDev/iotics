const mongoose = require("mongoose")

const schema = {
    device_id: { type: mongoose.Schema.Types.ObjectId, ref: "meter" },
    month: Date,
    data: {}
}

for (let i = 1; i <= 12; i++) {
    schema.data[i] = {
        full: Boolean,
        day: [{
            time: Date,
            values: {
                "parameter_A+": Number,
                "parameter_A-": Number,
                "parameter_R+": Number,
                "parameter_R-": Number,
            }
        }]
    }
}

const archiveSchema = new mongoose.Schema(schema)
module.exports.archiveModel = mongoose.model("archive", archiveSchema)