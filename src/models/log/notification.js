const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    code: Number,
}, {
    timestamps: true
})

module.exports.notificationModel = mongoose.model("notification", notificationSchema)