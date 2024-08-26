const { Router } = require('express')
const { getJournalStatistics, getJournalList } = require('../../controller/log/journal')
const { checkTokenRout } = require('../../middleware/token')

module.exports.routerJournal = Router()
    .get('/statistics/:id', checkTokenRout('one', 'log', 'journal'), getJournalStatistics)
    .get('/list/:id',  getJournalList)