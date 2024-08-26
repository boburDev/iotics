const { Router } = require('express')
const { checkTokenRout } = require('../../middleware/token')
const { findFolder, updateFolder, listFolder, statisticFolder } = require('../../controller/poll server/folder')

module.exports.routerFolder = Router()
    .get('/read', checkTokenRout('one', 'poll_server', 'folder'), findFolder)
    .get('/statistic', statisticFolder)
    .get('/tree-list', checkTokenRout('all', 'poll_server', 'folder'), listFolder)
    .put('/update', checkTokenRout('update', 'poll_server', 'folder'), updateFolder)