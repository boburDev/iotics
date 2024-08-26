const { errorJsonMessages } = require("../global/file_path")

module.exports.errorMessage = (code) => {
    const errors = errorJsonMessages
    return errors[code] || errors["0.000.000"]
}