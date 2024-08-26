const mongoose = require("mongoose")

const historySchema = new mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "sessions" },
    role: String,
    message: String,
    added_id: String
}, {
    timestamps: true
})

module.exports.historyModel = mongoose.model("history", historySchema)