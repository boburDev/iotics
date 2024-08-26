const electroDevices = require('./meters')
function deviceProtocol(data) {
    if (data && data.DeviceType == 'meter') {
        return electroDevices[data.DeviceModel]
    } else {
        return {}
    }
}

module.exports = {
    deviceProtocol
}
