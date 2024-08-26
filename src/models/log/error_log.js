const mongoose = require("mongoose")

const errorSchema = new mongoose.Schema({
    error_code: String,
    error_operation: String,
    error_message: String,
    error_body: String,
    code_for_user: String,  
    recommendations: String,
    error_description: String,
}, {
    timestamps: true
})

module.exports.errorModel = mongoose.model("error", errorSchema)