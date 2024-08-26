const { getDeviceProtocolInfo } = require("../utils/obis");

function energomeraResult(data, option) {
    try {
        if (option.requestType === 'current') {
            let results = []
            const valueConfig = option.resultRead
            for (const i of data) {
                let value = extractorFunc(i.buffer)
                let obis = i.obis.split('.').slice(0, -1).join('.')
                if (i.type == 'setting') {
                    meterConfig(value, option)
                } else if (i.type == 'current') {
                    let valueRes = currentValue(value, valueConfig[obis], option)
                    results.push(...valueRes)
                } else if (i.type == 'date') {
                    dateValue(value, valueConfig[obis])
                }
            }
            return results
        } else {
            console.error('nmadir neto ishladi, energomera result convertor!');
            return []
        }
    } catch (error) {
        console.log(error);
    }
}

function meterConfig(value, config) {
    return 
}

function currentValue(value, valueIndex, option) {
    let results = []
    for (const i in valueIndex) {
        let getIndex = valueIndex[i].split('.')
        let indexedData = value[getIndex[getIndex.length - 1]]
        // if (['1.11', '1.13'].includes(key)) {
        //     if (getIndex[getIndex.length - 1] == 0) {
        //         let dataValue = indexedData.split(',')
        //         results.push({ [optData[i]]: dataValue[dataValue.length - 1] * 10 })
        //     } else {
        //         results.push({ [optData[i]]: indexedData * 10 })
        //     }
        // } else {
        // }
        let { name } = getDeviceProtocolInfo(valueIndex[i], option)
        
        if (getIndex[getIndex.length - 1] == 0) {
            let dataValue = indexedData.split(',')
            results.push({ [name]: +dataValue[dataValue.length - 1] })
        } else {
            results.push({ [name]: +indexedData })
        }
    }
    return results
}

function dateValue(value, valueIndex) {
    console.log(value, valueIndex)
}

function extractorFunc(value) {
    let reBrackets = /\((.*?)\)/g;
    let sortedData = [];
    let found;
    while ((found = reBrackets.exec(value))) {
        sortedData.push(found[1]);
    }
    if (sortedData.length) {
        return sortedData;
    } else {
        return [value.toString()]
    }
}

module.exports = {
    energomeraResult
}
