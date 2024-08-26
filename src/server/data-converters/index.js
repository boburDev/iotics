const { energomeraResult } = require('./energomera');
const { TEAndEXResult } = require('./te&ex');
const { MercuryResult } = require('./mercury');
const { ModbusResult } = require('./modbus');


function meterResult(data, option) {
    if (option.DeviceShortName === 'CE') {
        return energomeraResult(data, option)
    } else if (option.DeviceShortName === 'TE' || option.DeviceShortName === 'EX') {
        return TEAndEXResult(data, option)
    } else if (option.DeviceShortName === 'Mercury') {
        return MercuryResult(data, option)
    } else if (option.DeviceShortName === 'ION' || option.DeviceShortName === 'Sepam') {
        return ModbusResult(data, option)
    }
}
module.exports = meterResult 