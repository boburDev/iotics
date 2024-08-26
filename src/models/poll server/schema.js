const mongoose = require("mongoose")

const schemaSchema = new mongoose.Schema({
    //
}, {
    timestamps: true
})

module.exports.schemaModel = mongoose.model("schema", schemaSchema)