const mongoose = require("mongoose")

const folderSchema = new mongoose.Schema({
    folder: String,
    elect: String,
    calc: String,
}, {
    timestamps: true
})

module.exports.folderModel = mongoose.model("folder", folderSchema)