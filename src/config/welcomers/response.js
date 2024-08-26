const CustomCatchError = require("../../errors/custom_catch_error")
const CustomError = require("../../errors/custom_error")

module.exports.Response = (args, data, status = 200) => {
    const access_token = args[0].access_token
    args[1].status(status).json({ status, data, message: null, code: null, error: null, cache: access_token })
}

module.exports.ResponseError = (args, err, code) => {
    const obj = {
        data: null,
    }

    let errorMessage
    let errorCode
    if (err instanceof CustomError) {
        errorMessage = err.error || null
        errorCode = err.code || code || "0.000.000"
    } else if (err instanceof Error) {
        errorMessage = err.message
        errorCode = code || "0.000.000"
    } else {
        errorMessage = err
        errorCode = code || "0.000.000"
    }

    const custom = new CustomCatchError(errorMessage, errorCode)
    obj.message = custom.clientMessage
    obj.code = custom.codeForUser
    obj.status = custom.status
    // if(errorCode == "0.001.000") {
    // obj.error = errorMessage.message
    obj.error_code = custom.code
    obj.error = errorMessage
    // } // BUG  togirlab qoy error_code chiqmasin

    args[1].status(obj.status || 500).json(obj)
}

module.exports.ResponseCookie = (args, access) => {
    args[0].access_token = access
}