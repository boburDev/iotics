const { EnergomeraResponse } = require('./energomera')
const { MercuryResponse } = require('./mercury')
const { ModbusResponse } = require('./modbus')
const { TEandEXResponse } = require('./te&ex')

async function getMeterResult(port, command, data, global) {
    if (data.DeviceShortName === 'CE') {
        return await EnergomeraResponse(port, command, data, global)
    } else if (data.DeviceShortName === 'TE' || data.DeviceShortName === 'EX') {
        return await TEandEXResponse(port, command, data, global)
    } else if (data.DeviceShortName === 'Mercury') {
        return await MercuryResponse(port, command, data, global)
    } else if (data.DeviceShortName === 'ION' || data.DeviceShortName === 'Sepam') {
        return await ModbusResponse(port, command, data, global)
    }
}

module.exports = getMeterResult
