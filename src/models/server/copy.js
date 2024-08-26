const mongoose = require("mongoose")

const copySchema = new mongoose.Schema({
    day: Number,
    location: String,
    last_copied_day: Date,
    active: { type: Boolean, default: true },
}, {
    timestamps: true
})

module.exports.copyModel = mongoose.model("copy", copySchema)