function protocolBuilder(command, data, sequence = null) {
    try {
        const { buffer: array } = command;
        const deviceType = data.DeviceShortName;

        switch (deviceType) {
            case 'CE':
                const hasCrc = command.hasOwnProperty('crc');
                if (hasCrc && !command.crc) {
                    return Buffer.from(array);
                } else {
                    return Buffer.from([...array, calculateCRC8(array)]);
                }
            case 'Mercury':
                const { crc1, crc2 } = calculateCRC16Modbus(array);
                return Buffer.from([...array, crc1, crc2]);

            case 'EX':
            case 'TE':
                return insertCrcIntoTEandEX(array, sequence);

            case 'ION':
            case 'Sepam':
                return Buffer.from([...array, ...crc16Modbus(array)]);

            default:
                throw new Error('Unsupported device type');
        }
    } catch (error) {
        if (Number(error.message)) {
            return {
                error: true,
                status: error.message,
                index: 12
            }
        } else {
            return {
                error: true,
                status: 110,
                message: error && error.message,
                index: 12
            }
        }
    }
}


function calculateCRC8(array) {
    try {
        const SOH = new Set([129, 1]);
        const STX = new Set([130, 2]);
        const ETX = new Set([3]);

        let data = array.slice();

        if (SOH.has(data[0]) || STX.has(data[0])) {
            data.shift();
        }

        let endIndex = data.findIndex(byte => ETX.has(byte));
        if (endIndex === -1) {
            endIndex = data.length;
        } else {
            endIndex++;
        }

        const verificationData = data.slice(0, endIndex);

        const sum = verificationData.reduce((acc, num) => acc + num, 0);
        const last7Bits = (sum & 0x7F).toString(2).padStart(7, '0');
        return parseInt(last7Bits, 2);
    } catch (error) {
        if (Number(error.message)) {
            return {
                error: true,
                status: error.message,
                index: 13
            }
        } else {
            return {
                error: true,
                status: 110,
                message: error && error.message,
                index: 13
            }
        }
    }
}

function calculateCRC16Modbus(array) {
    try {
        let crc = 0xffff;

        for (const byte of array) {
            crc ^= byte;
            for (let j = 0; j < 8; j++) {
                crc = (crc & 0x0001) !== 0 ? (crc >> 1) ^ 0xa001 : crc >> 1;
            }
        }

        const crc1 = crc & 0xff; // Low byte
        const crc2 = (crc >> 8) & 0xff; // High byte

        return { crc1, crc2 };
    } catch (error) {
        if (Number(error.message)) {
            return {
                error: true,
                status: error.message,
                index: 14
            }
        } else {
            return {
                error: true,
                status: 110,
                message: error && error.message,
                index: 14
            }
        }
    }
}

function insertCrcIntoTEandEX(array, sequence) {
    try {
        if (sequence != null) {
            const ParamSequence = [50, 84, 150, 216, 26, 92, 158, 208];
            const length = ParamSequence.length;
            let index = (sequence > length) ? (sequence % length) - 1 : sequence - 1;
            index = index < 0 ? length - 1 : index;
            array[8] = ParamSequence[index];
        }

        const newArray = array.slice();
        const startCommand = newArray.shift();
        const endCommand = newArray.pop();

        const crc1commands = newArray.slice(0, 8);
        const crc1 = ax25crc16(crc1commands);
        newArray.splice(8, 2, ...crc1);

        let newCommand = [startCommand, ...newArray, endCommand];

        if (newArray.length !== 10) {
            newArray.splice(newArray.length - 2, 2);
            const crc2 = ax25crc16(newArray);
            newCommand = [startCommand, ...newArray, ...crc2, endCommand];
        }

        return Buffer.from(newCommand);
    } catch (error) {
        if (Number(error.message)) {
            return {
                error: true,
                status: error.message,
                index: 15
            }
        } else {
            return {
                error: true,
                status: 110,
                message: error && error.message,
                index: 15
            }
        }
    }
}

function ax25crc16(dataArray) {
    try {
        let crc = 0xffff;
        const crc16_table = [
            0x0000, 0x1081, 0x2102, 0x3183, 0x4204, 0x5285, 0x6306, 0x7387,
            0x8408, 0x9489, 0xa50a, 0xb58b, 0xc60c, 0xd68d, 0xe70e, 0xf78f
        ];

        for (let byte of dataArray) {
            crc = (crc >> 4) ^ crc16_table[(crc & 0xf) ^ (byte & 0xf)];
            crc = (crc >> 4) ^ crc16_table[(crc & 0xf) ^ (byte >> 4)];
        }

        crc = (crc << 8) | ((crc >> 8) & 0xff);
        crc = (~crc & 0xffff).toString(16).toUpperCase().padStart(4, '0').match(/.{1,2}/g);
        return crc.map(chunk => parseInt(chunk, 16));
    } catch (error) {
        if (Number(error.message)) {
            return {
                error: true,
                status: error.message,
                index: 16
            }
        } else {
            return {
                error: true,
                status: 110,
                message: error && error.message,
                index: 16
            }
        }
    }
}

function crc16Modbus(array) {
    try {
        const generatorPolynomial = 0xa001;
        let crc = 0xffff;

        for (const byteValue of array) {
            crc ^= byteValue;

            for (let bitShifted = 0; bitShifted < 8; bitShifted++) {
                if (crc & 0x01) {
                    crc = (crc >> 1) ^ generatorPolynomial;
                } else {
                    crc >>= 1;
                }
            }
        }

        const crc1 = crc & 0xff;        // Low byte
        const crc2 = (crc >> 8) & 0xff; // High byte

        return [crc1, crc2];
    } catch (error) {
        if (Number(error.message)) {
            return {
                error: true,
                status: error.message,
                index: 12
            }
        } else {
            return {
                error: true,
                status: 110,
                message: error && error.message,
                index: 12
            }
        }
    }
}

module.exports = {
    protocolBuilder,
    calculateCRC8,
    calculateCRC16Modbus,
    insertCrcIntoTEandEX,
    crc16Modbus
}
