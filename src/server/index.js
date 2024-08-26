const { validateMeterInputs } = require('./utils/validate');
const { openPortTcpAndCom } = require('./configs/connection/open_connection')
const devconfig = require('./configs/devmodeconfigs.json');
const { meterOptions } = require('./utils/setups');
const { getDeviceResult } = require('./configs/meter_controller');

// const ErrorHandler = require('./errors');
// const setUp = require('./utils/setups');
// const { getLstMeterResult, getMeterResult } = require('./configs/meter_controllers');

let devMode = devconfig.devmode;
if (devMode) {
    ; (async () => {
        let data = {
            Id: '66a0e9cd1522ea20b86baed8',
            ConnectionType: 1,
            IpAddress: '192.168.0.50',
            Port: '8887',
            ResendCount: 3,
            WaitingTime: 10000,
            PauseTime: 20,
            DeviceType: 'meter',
            DeviceModel: 'CE_308',
            DeviceAddress: '194409155',
            DevicePassword: '777777',
            DeviceProtocol: '40007742',
            RegisterCode: ['1.0.0', '1.0.0.0', '1.1.0.0', '1.1.0.1', '1.1.0.2', '1.1.2.0', '1.1.3.0']
        }
        let result = await meterResponse(null, data, {});
        console.log('result is: ', result);
    })();
}

// let obj = {
//     "192.168.0.10:8887": true
// }

async function meterResponse(port, data, obj = {}) {
    try {
        if (!port) {
            port = await openPortTcpAndCom(data)
            if (port && port.error) return port
            port = port.port
        }
        const { error, value } = validateMeterInputs(data, 'meter');
        if (error) throw new Error(error.message);
        let options = meterOptions(value)
        let deviceResonse
        if (options.DeviceType == 'meter') {
            if (options && options.date) {
                console.log(1, options)
            } else {
                deviceResonse = await getDeviceResult(port, options, obj)
            }

            if (deviceResonse && deviceResonse.error) {
                console.log(deviceResonse);
                // let error = (deviceResonse && deviceResonse.body) ? deviceResonse : ErrorHandler(deviceResonse, configs);
                // return error
            } else {
                return {
                    data: deviceResonse,
                    message: null,
                    error: false
                }
            }
        }
    } catch (error) {
        if (Number(error.message)) {
            return {
                error: true,
                status: error.message,
                index: 0
            }
        } else {
            return {
                error: true,
                status: 110,
                message: error && error.message,
                index: 0
            }
        }
    }
}

module.exports = {
    meterResponse
}