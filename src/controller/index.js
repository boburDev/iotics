const { ResponseError } = require("../config/welcomers/response")

module.exports.notFound = (...args) => {
    return ResponseError(args, { url: args[0].originalUrl, method: args[0].method }, "0.014.000")
}
