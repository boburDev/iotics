const CustomError = require("../../errors/custom_error")

module.exports.loginChecking = (login, code) => {
    if (login.length >= 3 && login.length <= 64) {
        return true
    }

    throw new CustomError({ login }, code)
}

module.exports.passwordChecking = (password, code) => {
    if (password.length >= 8 && password.length <= 64) {
        return true
    }

    throw new CustomError({ password }, code)
}

module.exports.forgotPasswordChecking = (password) => {
    if (password.length == 6) {
        return true
    }

    throw new CustomError({ password }, "0.004.000")
}