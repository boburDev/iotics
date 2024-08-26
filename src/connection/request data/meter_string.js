module.exports.meterRequestString = (meter) => {
    return {
        MeterType: meter.meter_model,
        MeterModel: meter.meter_type,
        MeterAddress: meter.protokol,
        MeterPassword: meter.password,
        Protocol: meter.connection_address,
    }
}

module.exports.registerTime = (date) => {
    return {
        RegisterTime: {
            date1: new Date(date),
            date2: new Date()
        }
    }
}