const mongoose = require("mongoose")

const journalSchema = new mongoose.Schema({
    device_id: { type: mongoose.Schema.Types.ObjectId, ref: "meter" },
    device_type: String,
    date: Date,
    poll_log: [
        {
            state: String,
            poll_type: String,
            steps: [
                {
                    step: String,
                    step_code: String,
                    step_time: Date,
                }
            ]
        }
    ]
})

module.exports.journalModel = mongoose.model("journal", journalSchema)