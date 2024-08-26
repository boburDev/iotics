const mongoose = require("mongoose")
const { adminRolesList, notificationType } = require("../../global/enum")

const adminSchema = new mongoose.Schema({
    name: String,
    password: String,
    block: String,
    forgot_password: String,
    login: { type: String, unique: true },
    active: { type: Boolean, default: true },
    notification: [{ type: mongoose.Schema.Types.ObjectId, ref: "notification" }],
    notification_type: { type: Array, default: notificationType },
    notification_mute: { type: Array, default: [] },
    role: { type: String, enum: adminRolesList, default: adminRolesList[0] },
}, {
    timestamps: true
})

module.exports.adminModel = mongoose.model("admin", adminSchema)