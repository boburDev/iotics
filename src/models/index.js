const { adminModel } = require("./admin/admin");
const { sessionsModel } = require("./admin/sessions");
const { errorModel } = require("./log/error_log");
const { historyModel } = require("./log/history");
const { journalModel } = require("./log/journal");
const { channelModel } = require("./poll server/channel");
const { folderModel } = require("./poll server/folder");
const { meterModel } = require("./poll server/meter");
const { parameterModel } = require("./poll server/parameters");
const { schemaModel } = require("./poll server/schema");
const { uspdModel } = require("./poll server/uspd");
const { copyModel } = require("./server/copy");

module.exports = Object.freeze({
    adminModel,
    copyModel,
    sessionsModel,
    errorModel,
    historyModel,
    folderModel,
    channelModel,
    journalModel,
    meterModel,
    parameterModel,
    uspdModel,
    schemaModel
})