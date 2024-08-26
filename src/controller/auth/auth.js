const { RequestBody, RequestToken } = require("../../config/welcomers/request")
const { Response, ResponseCookie, ResponseError } = require("../../config/welcomers/response")
const { loginValidate, handshakeValidate, doubleCheckValidate, forgotPasswordValidate, informationValidate } = require("../../validation/auth/auth")
const { handshakeMessageIndex, handshakeLetters, handshakeCharacters } = require("../../global/variable")
const { loginChecking, passwordChecking, forgotPasswordChecking } = require("../../validation/auth/custom")
const { passwordValidate } = require("../../utils/password")
const { newObject } = require("../../func/helper_function")
const { connect } = require("../../service")
const { generateRandomString } = require("../../func/helper_function")

let obj = { "123412": true } // BUG bosh qilib qoy
module.exports.handshake = async (...args) => {
    try {
        const { public, product } = RequestBody(args, handshakeValidate)
        const key = generateRandomString(6)
        const message = key.split('')
        let result = []

        for (const letter of message) {
            const index = BigInt(handshakeMessageIndex[letter])
            const publicSQRT = BigInt(Math.sqrt(Number(public)));
            const productSQRT = BigInt(Math.sqrt(Number(product)));

            result.push(Number((index ** publicSQRT) % productSQRT));
            result.push(handshakeCharacters[Math.floor(Math.random() * handshakeCharacters.length)])
        }
        obj[key] = true

        const data = result
            .join('')
            .split('')
            .map(e => e + handshakeLetters[Math.floor(Math.random() * handshakeLetters.length)])
            .join('')

        return Response(args, { result: data })
    } catch (error) {
        return ResponseError(args, error, "0.013.000")
    }
}

module.exports.login = async (...args) => {
    let message
    try {
        const { login, password, application_name, application_version, location, uuid, os, key } = RequestBody(args, loginValidate)

        message = key
        if (!obj[key]) {
            return ResponseError(args, { obj, key }, "0.005.006")
        }

        loginChecking(login, "0.002.000")
        passwordChecking(password, "0.003.000")

        const find = await connect.auth.checkAuth(login, password)
        if (!find.block) {
            const { refresh, access, type } = await connect.session.checkSession(find, application_name, application_version, location, uuid, os)
            const data = newObject(find)
            data.refresh = refresh
            data.step = false
            data.type = type

            ResponseCookie(args, access)
            delete obj[key]
            return Response(args, data)
        }

        return Response(args, { step: true })
    } catch (err) {
        delete obj[message]
        return ResponseError(args, err, "0.005.000")
    }
}

module.exports.doubleCheck = async (...args) => {
    try {
        const { login, password, application_name, application_version, location, uuid, os, code, key } = RequestBody(args, doubleCheckValidate)

        if (!obj[key]) { return ResponseError(args, { obj, key }, "0.005.006") }
        delete obj[key]

        loginChecking(login, "0.002.000")
        passwordChecking(password, "0.003.000")
        passwordChecking(code, "0.006.001")

        const find = await connect.auth.checkAuth(login, password)
        if (find.block && passwordValidate(code, find.block)) {
            const { refresh, access } = await connect.session.checkSession(find, application_name, application_version, location, uuid, os)
            const data = newObject(find)
            delete data.password
            delete data.forgot_password
            delete data.block
            data.refresh = refresh

            ResponseCookie(args, access)
            return Response(args, 200, data)
        }

        return ResponseError(args, { code }, "0.006.001")
    } catch (error) {
        return ResponseError(args, error, "0.006.000")
    }
}

module.exports.forgotPassword = async (...args) => {
    try {
        const { login, application_name, application_version, location, uuid, os, forgot_password, key } = RequestBody(args, forgotPasswordValidate)

        if (!obj[key]) { return ResponseError(args, { obj, key }, "0.005.006") }
        delete obj[key]

        loginChecking(login, "0.002.000")
        forgotPasswordChecking(forgot_password)

        const find = await connect.auth.checkLogin(login)
        if (find.forgot_password && passwordValidate(forgot_password, find.forgot_password)) {
            const { refresh, access } = await connect.session.checkSession(find, application_name, application_version, location, uuid, os)
            const data = newObject(find)
            delete data.password
            delete data.forgot_password
            delete data.block
            data.refresh = refresh

            await connect.auth.update(find._id, { forgot_password: null })
            ResponseCookie(args, access)
            return Response(args, 200, data)
        }

        return ResponseError(args, { forgot_password }, "0.004.000")
    } catch (error) {
        return ResponseError(args, error, "0.007.000")
    }
}

module.exports.logout = async (...args) => {
    try {
        const { session } = RequestToken(args)

        await connect.session.delete(session)
        return Response(args, "Successful logout", 200)
    } catch (error) {
        return ResponseError(args, error, "0.015.000")
    }
}

module.exports.information = async (...args) => {
    try {
        const { key } = RequestBody(args, informationValidate)
        if (!obj[key]) { return ResponseError(args, { obj, key }, "0.026.001") }
        delete obj[key]

        const count = await connect.admin.findSuperAdminCount("0.026.002")
        return Response(args, { open: !count })
    } catch (error) {
        return ResponseError(args, error, "0.026.000")
    }
}

module.exports.handshakeObj = obj