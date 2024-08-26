const { Router } = require('express')
const { createCopy, updateCopy, restorationCopy } = require('../../controller/server/copy')
const { checkToken } = require('../../middleware/token')
const { adminRolesList } = require('../../global/enum')

module.exports.routerCopy = Router()
    .get('/restoration', restorationCopy)
    .post('/create', createCopy)
    .patch('/update', checkToken(adminRolesList[0], adminRolesList[1], adminRolesList[2]), updateCopy)
