const { energomeraOBIS } = require('./energomera');
const { TEAndEXOBIS } = require('./te&ex');
const { MercuryOBIS } = require('./mercury');
const { ModbusOBIS } = require('./modbus');

function getProtocol(data) {
    if (data.DeviceShortName === 'CE') {
        return energomeraOBIS(data)
    } else if (data.DeviceShortName === 'TE' || data.DeviceShortName === 'EX') {
        return TEAndEXOBIS(data)
    } else if (data.DeviceShortName === 'Mercury') {
        return MercuryOBIS(data)
    } else if (data.DeviceShortName === 'ION' || data.DeviceShortName === 'Sepam') {
        return ModbusOBIS(data)
    }
}
module.exports = getProtocol
