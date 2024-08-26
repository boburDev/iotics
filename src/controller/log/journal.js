const { RequestParams, RequestQuery } = require("../../config/welcomers/request")
const { ResponseError, Response } = require("../../config/welcomers/response")
const { todayFormat } = require("../../connection/utils")
const { stateList } = require("../../global/enum")
const { connect } = require("../../service")
const { journalStatisticsValidate, journalListValidate } = require("../../validation/log/journal")

module.exports.getJournalStatistics = async (...args) => {
    try {
        const { id } = RequestParams(args)
        const { date } = RequestQuery(args, journalStatisticsValidate)

        const find = await connect.journal.findOne("0.051.001", id, todayFormat(date))
        if (!find) {
            return ResponseError(args, { id, find }, "0.051.002")
        }

        let successful = 0, failed = 0, missed = 0
        find.poll_log.forEach((e) => {
            if (e.state == stateList[0]) { successful++ }
            if (e.state == stateList[1]) { failed++ }
            if (e.state == stateList[2]) { missed++ }
        })
        return Response(args, {
            all: find.poll_log.length,
            successful, failed, missed
        })
    } catch (error) {
        return ResponseError(args, error, "0.051.000")
    }
}

module.exports.getJournalList = async (...args) => {
    try {
        const { id } = RequestParams(args)
        const { date, limit, type, result, page, time } = RequestQuery(args, journalListValidate)

        const pageLimit = Number(limit) || 20
        const pageStep = (Number(page) || 0) * pageLimit
        const find = await connect.journal.findOne("0.052.001", id, todayFormat(date))
        if (!find) {
            return ResponseError(args, { id, find }, "0.052.002")
        }

        const filter = []
        find.poll_log.forEach(e => {
            let check = { time: true, type: true, result: true }
            if (type) {
                if (e.poll_type == type) { check.type = true }
                else { check.type = false }
            }
            if (result) {
                if (e.state == result) { check.result = true }
                else { check.result = false }
            }
            if (time) {
                if (e.state == result) { check.time = true }
                else { check.time = false }
            }

            if (Object.values(check).every(e => e)) {
                filter.push(e)
            }
        })

        const pagination = Math.ceil(filter.length / limit)
        if (page > pagination) {
            return ResponseError(args, { page, pagination }, "0.052.003")
        }

        const slice = filter.slice(pageStep, pageStep + pageLimit)
        return Response(args, {
            page: page || 1,
            limit: pageLimit,
            pagination,
            list: slice,
        })
    } catch (error) {
        return ResponseError(args, error, "0.052.000")
    }
}