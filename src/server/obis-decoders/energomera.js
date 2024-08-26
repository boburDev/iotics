const { getDeviceObisCommands, obisType, sortSettingObis, getDeviceProtocolInfo, updateVariables } = require('../utils/obis')

function energomeraOBIS(params) {
    try {
        let obis = params.obis
        let settings = getDeviceObisCommands(params, 'setting')['setting']
        if (settings && settings.error) return settings
        let startCommands = []
        if (obisType(obis, '1')) {
            for (const i of settings) {
                if (!['metor_memory', 'model'].includes(i.name)) {
                    startCommands.push(i.obis)
                }
            }
            startCommands = startCommands.sort(sortSettingObis)
            let sortedObis = {}
            let newObis = []

            obis.forEach(i => {
                if (i.split('.').length == 4) {
                    let newVersion = i.split('.').slice(0, -1).join('.');
                    if (!sortedObis[newVersion]) {
                        sortedObis[newVersion] = [];
                        newObis.push(newVersion);
                    }
                    sortedObis[newVersion].push(i);
                };
            });

            startCommands.splice(3, 0, ...newObis);
            let obisCode = commandsCE(startCommands, params);
            if (obisCode && obisCode.error) return obisCode
            return {
                obis: obisCode,
                resultParsing: sortedObis
            }
        } else if (obisType(obis, '2')) {

        } else if (obisType(obis, '3')) {

        } else if (obisType(obis, '4')) {

        }
    } catch (error) {
        if (Number(error.message)) {
            return {
                error: true,
                status: error.message,
                index: 8
            }
        } else {
            return {
                error: true,
                status: 110,
                message: error && error.message,
                index: 8
            }
        }
    }
}

function commandsCE(valueArray, configs) {
    try {
        let values = []
        for (const i of valueArray) {
            let value = getDeviceProtocolInfo(i, configs)
            if (value && value.error) return value

            if (value && value.name == 'address') {
                let data = updateVariables(value.buffer, configs.DeviceAddress, 2)
                if (data && data.error) return data
                value.buffer = data
            } else if (value && value.name == 'password') {
                let data = updateVariables(value.buffer, configs.DevicePassword, 5)
                if (data && data.error) return data
                value.buffer = data
            }
            values.push(value)
        }
        return values
    } catch (error) {
        if (Number(error.message)) {
            return {
                error: true,
                status: error.message,
                index: 9
            }
        } else {
            return {
                error: true,
                status: 110,
                message: error && error.message,
                index: 9
            }
        }
    }
}



module.exports = {
    energomeraOBIS
}
