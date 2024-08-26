const { deviceProtocol } = require('../models')

function obisToNumber(obis) {
    return obis.split('.').map(part => part.padStart(4, '0')).join('');
}

function getDeviceObisCommands(data, type) {
    try {
        const protocols = deviceProtocol(data);
        const params = {};

        if (['date', 'current', 'billing', 'archive', 'setting'].includes(type)) {
            protocols.forEach(item => {
                if (item.type === type) {
                    const value = { name: item.name, obis: item.obis, param_type: item.param_type };
                    const typeParams = params[item.type] || (params[item.type] = {});

                    const existingItem = typeParams[item.name];
                    if (!existingItem || obisToNumber(item.obis) < obisToNumber(existingItem.obis)) {
                        typeParams[item.name] = value;
                    }
                } else {
                    return;
                }
            });

            return Object.fromEntries(
                Object.entries(params).map(([type, items]) => [
                    type,
                    Object.values(items).map(item => ({ name: item.name, obis: item.obis }))
                ])
            );
        } else {
            protocols.forEach(item => {
                if (item.type === "setting") return;

                const value = { name: item.name, obis: item.obis, param_type: item.param_type };
                const typeParams = params[item.type] || (params[item.type] = {});

                const existingItem = typeParams[item.name];
                if (!existingItem || obisToNumber(item.obis) < obisToNumber(existingItem.obis)) {
                    typeParams[item.name] = value;
                }
            });

            return Object.fromEntries(
                Object.entries(params).map(([type, items]) => [
                    type,
                    Object.values(items).map(item => ({ name: item.name, obis: item.obis, param_type: item.param_type }))
                ])
            );
        }
    } catch (error) {
        if (Number(error.message)) {
            return {
                error: true,
                status: error.message,
                index: 6
            }
        } else {
            return {
                error: true,
                status: 110,
                message: error && error.message,
                index: 6
            }
        }
    }
}

let value = categorizeData({ DeviceType: 'meter', DeviceModel: 'CE_308_240' })
console.log(value.current);
// console.log(value.billing);
// console.log(value.archive);
// console.log(value);

// let value = categorizeData({ DeviceType: 'meter', DeviceModel: 'CE_308_40007742' })
// console.log(getDeviceObisCommands({ DeviceType: 'meter', DeviceModel: 'CE_308_40007742' }));

function categorizeData(data) {
    const result = {};
    const protocols = deviceProtocol(data);
    protocols.forEach(item => {
        const { type, obis, param_type, name } = item;
        if (type === "setting") return;
        if (!result[type]) {
            result[type] = [];
        }

        const existingEntry = result[type].find(entry => entry.param_type === param_type);

        if (existingEntry) {
            let check = true;
            for (const i of existingEntry.obis) {
                if (i.name === name) {
                    check = false;
                    break;
                }
            }
            if (check) {
                existingEntry.obis.push({ name, obis });
            }
        } else {
            result[type].push({
                param_type,
                obis: [{ name, obis }]
            });
        }
    });

    return result;
}

function obisType(array, numberString) {
    if (array.filter(item => item[0] == numberString).length) {
        return true
    }
    return false
}

function sortSettingObis(a, b) {
    const numA = parseInt(a.split('.').pop(), 10);
    const numB = parseInt(b.split('.').pop(), 10);
    return numA - numB;
}

function getDeviceProtocolInfo(obisCode, data) {
    try {
        const protocols = deviceProtocol(data);
        if (!protocols) throw new Error('Device model not found')
        let results = {}
        for (const i of protocols) {
            if (obisCode.split('.').length >= 4 && i.obis == obisCode) {
                results = i
            } else if (obisCode.split('.').length < 4 && i.obis.split('.').slice(0, -1).join('.') == obisCode) {
                results = i
            }
        }
        return results
    } catch (error) {
        if (Number(error.message)) {
            return {
                error: true,
                status: error.message,
                index: 10
            }
        } else {
            return {
                error: true,
                status: 110,
                message: error && error.message,
                index: 10
            }
        }
    }
}

function updateVariables(array, param, index, deleteElement = 0) {
    try {
        let strIntoCharAtArray = Array.isArray(param) ? param : Array.from(param, c => c.charCodeAt(0));
        let data = [...array];
        data.splice(index, deleteElement, ...strIntoCharAtArray);
        return data;
    } catch (error) {
        if (Number(error.message)) {
            return {
                error: true,
                status: error.message,
                index: 11
            }
        } else {
            return {
                error: true,
                status: 110,
                message: error && error.message,
                index: 11
            }
        }
    }
}

module.exports = {
    getDeviceObisCommands,
    obisType,
    sortSettingObis,
    getDeviceProtocolInfo,
    updateVariables,
    categorizeData
}
