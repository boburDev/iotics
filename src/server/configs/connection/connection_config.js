const { InterByteTimeoutParser } = require('serialport');
const devconfig = require('../devmodeconfigs.json')

function writeToPort(port, data) {
    if (devconfig && devconfig.console_write) {
        console.log();
        console.log(11, data.buffer);
    }
    return new Promise((resolve) => {
        try {            
            if (port.writable !== true) throw new Error('Tcp port is not writable!');
            if (port.constructor.name.toLowerCase() === 'serialport' && !port.isOpen) throw new Error('Com port is not writable!')
            let writtenStatus = port.write(data.buffer, error => {
                if (error) throw new Error(error.message);
                if (writtenStatus) {
                    let sendStatusTime = setTimeout(() => {
                        clearTimeout(sendStatusTime);
                        resolve({
                            error: false,
                            message: 'written',
                            status: 200
                        });
                    }, data.PauseTime);
                } else {
                    throw new Error('write status closed!');
                }
            })
        } catch (error) {
            if (Number(error.message)) {
                resolve({
                    error: true,
                    status: error.message,
                    index: 2
                })
            } else {
                resolve({
                    error: true,
                    status: 110,
                    message: error && error.message,
                    index: 2
                })
            }
        }
    })
}

function waitForData(port, { func: validateBuffer, data: opt }, global) {
    return new Promise((resolve) => {
        try {
            let timeout = opt.WaitingTime
            if (port.writable !== true) throw new Error('Tcp port is not writable!');
            if (port.constructor.name.toLowerCase() === 'serialport' && !port.isOpen) throw new Error('Com port is not writable!')
            let buffer = Buffer.alloc(0);

            let timer = setTimeout(() => {
                port.removeAllListeners('data');
                port.removeAllListeners('end');
                clearTimeout(timer);
                resolve({ error: true, status: 'Timeout Waiting for data no result in proccess!', index: 3 })
            }, timeout);

            const dataHandler = async data => {
                if (devconfig && devconfig.console_read) {
                    console.log();
                    console.log(11, data);
                }
                clearTimeout(timer);
                timer = setTimeout(() => {
                    port.removeAllListeners('data');
                    port.removeAllListeners('end');
                    clearTimeout(timer);
                    resolve({ error: true, status: 'Incompleted data!', index: 3 });
                }, timeout);

                buffer = Buffer.concat([buffer, data]);
                let checkCrc = validateBuffer(buffer, opt)
                if (checkCrc.crc === true) {
                    buffer = checkCrc.buffer
                    port.removeAllListeners('data');
                    port.removeAllListeners('end');
                    clearTimeout(timer);
                    resolve({ error: false, data: buffer, message: null });
                } else {
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        port.removeAllListeners('data');
                        port.removeAllListeners('end');
                        clearTimeout(timer);
                        resolve({ error: true, status: 'Incompleted data!', index: 3 });
                    }, timeout);
                }
            };
            port.on('data', dataHandler);
        } catch (error) {
            if (Number(error.message)) {
                resolve({
                    error: true,
                    status: error.message,
                    index: 3
                })
            } else {
                resolve({
                    error: true,
                    status: 110,
                    message: error && error.message,
                    index: 3
                })
            }
        }
    })
}

async function resendAgain(port, command, options) {
    try {
        if (port.writable !== true) throw new Error('Tcp port is not writable!');
        if (port.constructor.name.toLowerCase() === 'serialport' && !port.isOpen) throw new Error('Com port is not writable!')
        console.log('resending...');
        let data
        let tryCount = options.data.ResendCount
        while (tryCount > 0) {
            let writeStatus = await writeToPort(port, command).catch(error => error);
            if (writeStatus && writeStatus.error) return { ...writeStatus, fromIndex: 4 };
            data = await waitForData(port, options).catch(error => error);
            if (data && !data.error) return data;
            tryCount--
        }
        return {
            ...data,
            tryCount: options.data.ResendCount - tryCount,
            error: true
        }
    } catch (error) {
        if (Number(error.message)) {
            return {
                error: true,
                status: error.message,
                index: 4
            }
        } else {
            return {
                error: true,
                status: 110,
                message: error && error.message,
                index: 4
            }
        }
    }
}

function removeListeners(port) {
    port.removeAllListeners('error')
    port.removeAllListeners('close')
    port.removeAllListeners('drain')
    port.removeAllListeners('end')
    port.removeAllListeners('data')
}

module.exports = {
    writeToPort,
    waitForData,
    resendAgain,
    removeListeners
}
