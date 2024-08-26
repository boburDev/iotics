const { protocolBuilder, calculateCRC8 } = require('../utils/crc')
const { writeToPort, waitForData, resendAgain } = require('./connection/connection_config')

const bufferSetUp = {
    'address': [13, 10],
    'password': [6]
};

async function EnergomeraResponse(port, commandObj, data, global) {
    return new Promise(async (resolve) => {
        try {
            if (data && data.ConnectionType == 1) {
                commandObj.buffer = commandObj.buffer.map(i => {
                    if (i < 127 && calculateEvenParity(i.toString(2)) == 1) {
                        i += 128
                    }
                    return i;
                })
            }
            let key = commandObj.param_type
            let command = protocolBuilder(commandObj, data);
            commandObj.buffer = command
            commandObj['PauseTime'] = data.PauseTime
            updateExpectedValues(data, key)
            let writeRes = await writeToPort(port, { ...commandObj }, global).catch(error => error);
            if (writeRes && writeRes.error) {
                resolve(writeRes);
                return
            }
            let options = { func: checkCrc, data }

            if (key === 'close') {
                let timer = setTimeout(() => {
                    clearTimeout(timer)
                    commandObj['error'] = false
                    resolve(commandObj)
                }, 1000)
            } else {
                let response = await waitForData(port, options, global).catch(error => error);
                if (response && response.error) {
                    response = await resendAgain(port, commandObj, options)
                    if (response && response.error) {
                        resolve({
                            attempted: response.tryCount + 1 || 1,
                            obis: key,
                            ...response,
                            fromIndex: 17
                        });
                        return;
                    }
                }
                commandObj.buffer = response.data
                commandObj['error'] = false
                resolve(commandObj)
                return
            }
        } catch (error) {
            if (Number(error.message)) {
                resolve({
                    error: true,
                    status: error.message,
                    index: 17
                })
            } else {
                resolve({
                    error: true,
                    status: 110,
                    message: error && error.message,
                    index: 17
                })
            }
        }
    })
}

function updateExpectedValues(data, key) {
    data['bufferSetUp'] = bufferSetUp[key] || [3];
}

function calculateEvenParity(bitString) {
    bitString = String(bitString);
    if (!/^[01]+$/.test(bitString)) throw new Error('Input must be a binary string');

    const countOnes = [...bitString].reduce((count, char) => count + (char === '1'), 0);
    return countOnes % 2 === 0 ? '0' : '1';
}

function equalArrays(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}

function checkCrc(buffer, data) {
    const bufferHex = buffer.toString('hex');

    if (bufferHex == '95') {
        return {
            crc: true,
            buffer
        };
    }

    if (data.bufferSetUp[0] == 6) {
        return {
            crc: bufferHex == '06',
            buffer
        };
    }

    if (data.ConnectionType == 1) {
        buffer = Buffer.from(buffer.map(i => {
            if (i > 127 && calculateEvenParity(i.toString(2)) == 0) {
                i -= 128
            }
            return i
        }))
    }

    if (data.bufferSetUp[0] == 3) {
        const checkCRC = [...buffer];
        const crc = checkCRC.pop();
        const etx = checkCRC.pop();
        let newCrc = calculateCRC8(checkCRC) + etx
        return {
            crc: crc == newCrc,
            buffer
        };
    }

    const lastTwoBytes = buffer.slice(-2);
    return {
        crc: equalArrays(lastTwoBytes, data.bufferSetUp),
        buffer
    };
}

module.exports = {
    EnergomeraResponse
}
