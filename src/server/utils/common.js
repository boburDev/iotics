function checkCounterType(params, str) {
    return params.DeviceModel.includes(str);
}

module.exports = {
    checkCounterType
}
