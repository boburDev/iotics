const mongoose = require("mongoose")
const { sessionType, modulesList } = require("../../global/enum")

const baseSchema = {
    application_name: String,
    application_version: String,
    location: String,
    refresh: Date,
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
    type: { type: String, enum: sessionType },
    last_active: { type: String, default: '' },
    refresh_key: { type: String, default: '' },
    uuid: { type: String, unique: true },
    os: { type: String, unique: true },
}

modulesList.forEach(module => {
    baseSchema[`${module}_access`] = {
        access: Date,
        access_key: { type: String, default: '' },
    };
});

const sessionsSchema = new mongoose.Schema(baseSchema, { timestamps: true })
module.exports.sessionsModel = mongoose.model("sessions", sessionsSchema)