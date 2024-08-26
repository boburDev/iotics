const { Router } = require('express')
const { checkToken } = require('../../middleware/token')
const { getOneNotification, getAllNotification, updateNotification } = require('../../controller/log/notification')

module.exports.routerNotification = Router()
    .get('/all', checkToken(), getAllNotification)
    .get('/one/:id', checkToken(), getOneNotification)
    .put('/update', checkToken(), updateNotification)