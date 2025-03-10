const { Router } = require('express')
const { login, handshake, doubleCheck, forgotPassword, logout, information } = require('../../controller/auth/auth')
const { refreshToken, checkToken } = require('../../middleware/token')

module.exports.routerAuth = Router()
    .post('/information', information)
    .post('/handshake', handshake)
    .post('/login', login)
    .post('/double-check', doubleCheck)
    .post('/forgot-password', forgotPassword)
    .post('/refresh', refreshToken)
    .post('/logout', checkToken(), logout)
