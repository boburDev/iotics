const path = require('path')
const fs = require('fs');
const CustomCatchError = require('../../errors/custom_catch_error');
const models = require('../../models');
const { databaseList } = require("../../global/file_path");
const { connect } = require("../../service");

let process = true
module.exports.startCopyLoop = () => {
    try {
        function loop() {

            const timeout = setTimeout(async () => {
                console.log('Copy olish boshlanmoqda')
                const copy = await connect.copy.find("0.060.001")
                const lastCopiedDate = new Date(copy.last_copied_day);
                const currentDate = new Date();

                const differenceInMillis = currentDate.getTime() - lastCopiedDate.getTime();
                const differenceInDays = differenceInMillis / (1000 * 3600 * 24);

                if (differenceInDays >= copy.day) {

                    for (const baza in databaseList) {
                        const { status, fileName, key } = databaseList[baza]

                        const folderPath = path.join(copy.location, 'IOTICS BACKUP');
                        if (!fs.existsSync(folderPath)) {
                            fs.mkdirSync(folderPath)
                        }

                        if (status == 'update') {
                            const all = await models[baza].find().lean().exec()
                            const jsonData = JSON.stringify(all, null, 2);

                            const filePath = path.join(folderPath, fileName + '.json');
                            fs.writeFileSync(filePath, jsonData, 'utf8');
                        } else {
                            const filter = await models[baza].find({ [key]: { $gt: copy.last_copied_day, $lte: currentDate } }).lean().exec()
                            const jsonData = JSON.stringify(filter, null, 2);

                            const filePath = path.join(folderPath, fileName + "-" + new Date().getTime() + '.json');
                            fs.writeFileSync(filePath, jsonData, 'utf8');
                        }
                    }

                    await connect.copy.update("0.060.002", copy._id, { last_copied_day: currentDate })
                }

                console.log('Copy olish tugadi')
                clearTimeout(timeout)
                loop()
            }, 24 * 60 * 60 * 1000);
        }

        if (process) loop()
        process = false
    } catch (err) {
        console.log(err)
        const error = new CustomCatchError(err, "0.060.000")
        console.log(error)
        process = true
        this.startCopyLoop()
    }
}