const { connectionConfig } = require("../../utils/setups");
const { validateMeterInputs } = require("../../utils/validate");
const devconfig = require('../devmodeconfigs.json')

function openPortTcpAndCom(data) {
    return new Promise((resolve) => {
        try {
            let devmode = devconfig && devconfig.devmode
            const { error, value } = validateMeterInputs(data, devmode ? 'meter' : '');
            if (error) throw new Error(error.message);
            let port = connectionConfig(value)
            const isSocket = port.constructor.name.toLowerCase() === 'socket';
            const isSerialPort = port.constructor.name.toLowerCase() === 'serialport';
            if (!isSocket && !isSerialPort) throw new Error('Invalid port!')
            port.removeAllListeners('error')
            port.on('error', error => {
                port.removeAllListeners('error')
                resolve({
                    error: true,
                    status: 110,
                    message: error && error.message,
                    index: 1
                })
            })
            const onOpen = error => {
                if (error) {
                    throw new Error(error.message);
                }
            };
            if (isSocket) {
                port = port.connect(port.settings, error => {
                    if (error) {
                        throw new Error(error.message);
                    }
                });
                resolve({
                    error: false,
                    message: 'connected',
                    status: 200,
                    port: port
                });
                return
            } else if (isSerialPort) {
                port = port.open(onOpen);
                resolve({
                    error: false,
                    message: 'connected',
                    status: 200,
                    port: port
                });
                return
            }
        } catch (error) {
            if (Number(error.message)) {
                resolve({
                    error: true,
                    status: error.message,
                    index: 1
                })
            } else {
                resolve({
                    error: true,
                    status: 110,
                    message: error && error.message,
                    index: 1
                })
            }
        }
    })
}

module.exports = {
    openPortTcpAndCom
}
