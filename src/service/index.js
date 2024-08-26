const admin = require('./admin/admin')
const auth = require("./auth/auth");
const session = require("./auth/session");
const copy = require("./server/copy");
const error = require("./log/error_log");
const history = require("./log/history");
const notification = require('./log/notification');
const folder = require('./poll server/folder');
const channel = require('./poll server/channel');
const meter = require('./poll server/meter');
const parameters = require('./poll server/parameters');
const uspd = require('./poll server/uspd');
const journal = require('./log/journal');

module.exports.connect = Object.freeze({
    admin,
    auth,
    session,
    copy,
    error,
    history,
    notification,
    folder,
    channel,
    meter,
    uspd,
    journal,
    parameters
})