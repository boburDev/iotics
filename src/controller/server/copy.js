const fs = require('fs')
const path = require('path')
const models = require("../../models")
const { RequestBody, RequestToken } = require("../../config/welcomers/request")
const { Response, ResponseError } = require("../../config/welcomers/response")
const { nullOrUndefined } = require("../../func/helper_function")
const { copyDefaultData, databaseList } = require("../../global/file_path")
const { connect } = require("../../service")
const { copyCreateValidate } = require("../../validation/server/copy")

module.exports.createCopy = async (...args) => {
    try {
        const defaultData = copyDefaultData()
        const { day = defaultData[0], location = defaultData[1], last_copied_day = defaultData[2] } = RequestBody(args, copyCreateValidate)
        const find = await connect.copy.find("0.009.002")

        if (!find) {
            await connect.copy.create("0.009.003", { day, location, last_copied_day })
            return Response(args, 200, "Successful Created")
        } else {
            return ResponseError(args, null, "0.009.001")
        }
    } catch (error) {
        return ResponseError(args, error, "0.009.000")
    }
}

module.exports.updateCopy = async (...args) => {
    try {
        const { day, location, last_copied_day, active } = RequestBody(args, copyCreateValidate)
        const find = await connect.copy.find("0.016.001")

        await connect.copy.update("0.016.002", find._id, {
            day: nullOrUndefined(day) ? find.day : day,
            location: location || find.location,
            last_copied_day: last_copied_day || find.last_copied_day,
            active: nullOrUndefined(active) ? find.active : active
        })
        return Response(args, "Successful Updated", 200)
    } catch (error) {
        return ResponseError(args, error, "0.016.000")
    }
}

module.exports.restorationCopy = async (...args) => {
    try {
        const { admin, session, role } = RequestToken(args)
        const copy = await connect.copy.find("0.010.001")
        const folderPath = path.join(copy.location, 'IOTICS BACKUP');
        const files = {}

        await connect.history.create({
            admin, session, role,
            message: "Hamma bazani qayta tiklashga urinish"
        })

        const folder = fs.readdirSync(folderPath)
        for (const file of folder) {
            const split = file.split('-')
            const fileName = split[0]
            if (split.reverse()[0] == 'create.json') {
                if(files[fileName]) {
                    files[fileName].push(file)
                } else {
                    files[fileName] = [file]
                }
            }
        }

        for (const baza in databaseList) {
            const { status, fileName, key } = databaseList[baza]
            await models[baza].deleteMany()

            if (status == 'update') {
                const filePath = path.join(folderPath, fileName + '-update.json');
                const data = JSON.parse(fs.readFileSync(filePath).toString());
                await models[baza].insertMany(data)
            } else {
                for (const file of files[fileName]) {
                    const filePath = path.join(folderPath, file);
                    const data = JSON.parse(fs.readFileSync(filePath).toString());
                    await models[baza].insertMany(data)
                }
            }
        }

        return Response(args, "Successful Restoration", 200)
    } catch (error) {
        return ResponseError(args, error, "0.010.000")
    }
}