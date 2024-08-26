const { RequestBody, RequestQuery } = require("../../config/welcomers/request")
const { ResponseError, Response } = require("../../config/welcomers/response")
const { connect } = require("../../service")
const { folderUpdateValidate, folderStatisticValidate } = require("../../validation/poll server/folder")

module.exports.findFolder = async (...args) => {
    try {
        const find = await connect.folder.find("0.034.002")
        if (!find) { return ResponseError(args, { find }, "0.034.001") }

        return Response(args, find)
    } catch (error) {
        return ResponseError(args, error, "0.034.000")
    }
}

module.exports.listFolder = async (...args) => {
    try {
        const find = await connect.folder.fullList("0.051.001")
        return Response(args, find)
    } catch (error) {
        return ResponseError(args, error, "0.051.000")
    }
}

module.exports.updateFolder = async (...args) => {
    try {
        const { folder, elect, calc } = RequestBody(args, folderUpdateValidate)

        const find = await connect.folder.find("0.035.003")
        if (!find) { return ResponseError(args, { find }, "0.035.001") }

        await connect.folder.update("0.035.002", find._id, { folder, elect, calc })
        return Response(args, { folder, elect, calc })
    } catch (error) {
        return ResponseError(args, error, "0.035.000")
    }
}

module.exports.statisticFolder = async (...args) => {
    try {
        const { link } = RequestQuery(args, folderStatisticValidate)
        const find = await connect.folder.find("0.053.001")
        if (!find) { return ResponseError(args, { find }, "0.053.002") }
        if (!find.folder.length) { return Response(args, {}) }

        const folders = JSON.parse(find.folder)
        const indexs = JSON.parse(link)
        let findFolder = folders
        let successful = true

        for (const index of indexs) {
            if (findFolder && findFolder[index].folders) {
                findFolder = findFolder[index].folders
            } else {
                successful = false
            }
        }
        if (!successful) { return ResponseError(args, { findFolder, indexs }, "0.053.003") }

        const meters = findFolder.filter(e => e.folder_type == 'meter')
        return Response(args, {
            all: meters.length,
            active: 0,
            inactive: 0,
            notConnected: 0 // BUG journal tolliq shakillangach haqiqiy shotchiklar qoshilgach 3ta narsa qoshiladi
        })
    } catch (error) {
        return ResponseError(args, error, "0.053.000")
    }
}