const getProtocol = require("../obis-decoders");
const { checkCounterType } = require('../utils/common')
const deviceResponse = require('./index')
const ErrorHandler = require('../errors')
const responseConverter = require('../data-converters')

async function getDeviceResult(port, data, global) {
    try {
        let deviceProtocol = getProtocol(data);
        if (deviceProtocol && deviceProtocol.error) return deviceProtocol;
        let results = [];
        data['requestType'] = 'current'
        if (checkCounterType(data, 'CE')) {
            for (const command of deviceProtocol.obis) {
                const value = Object.values(command)[0];
                if (value && value.length) {
                    const meterResponse = await deviceResponse(port, command, data, global)
                    if (meterResponse && meterResponse.error) return ErrorHandler(meterResponse, data);
                    if (meterResponse) {
                        results.push(meterResponse)
                    }
                }
            }
            data['resultRead'] = deviceProtocol.resultParsing;
            return responseConverter(results, data);
        }
    } catch (error) {
        if (Number(error.message)) {
            return {
                error: true,
                status: error.message,
                index: 7
            }
        } else {
            return {
                error: true,
                status: 110,
                message: error && error.message,
                index: 7
            }
        }
    }
}

module.exports = {
    getDeviceResult
}
