const { Router } = require('express')
const { checkToken } = require('../../middleware/token')
const { socketController } = require('../../web')

module.exports.routerSocket = Router()
    .get('/', checkToken(), socketController)
