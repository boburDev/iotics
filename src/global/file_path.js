const os = require('os');
const { getJson } = require('./get_json');

// One Line
module.exports.databaseList = getJson('copy')
module.exports.notificationMessages = getJson('notification')
module.exports.errorJsonMessages = getJson('errors')
module.exports.modelList = Object.keys(require('../server/models/meters'))

// Functions
module.exports.copyDefaultData = () => {
    const userInfo = os.userInfo();
    const platform = os.platform()
    let downloadsPath;

    if (platform == 'win32') {
        downloadsPath = `C:\\Users\\${userInfo.homedir.split('\\').reverse()[0]}\\Downloads`;
    } else if (platform == 'mac' || platform == 'darwin') {
        downloadsPath = `/Users/${userInfo.homedir.split('/').reverse()[0]}/Downloads`;
    } else if (platform == 'linux') {
        downloadsPath = `/home/${userInfo.homedir.split('/').reverse()[0]}/Downloads`;
    } else {
        throw new Error('Unsupported OS');
    }

    return [10, downloadsPath, new Date()]
}