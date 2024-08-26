const CustomCatchError = require("../errors/custom_catch_error")
const { periodTypeEnum } = require("../global/enum")
const { openPortTcpAndCom } = require("../server/configs/connection/open_connection")
const global = require("./global")
const { channelConnectionString } = require("./request data/channel_string")
const { minuteConcentrate, responseControllSuccessful, responseControllStop } = require("./utils")

module.exports.requestTime = (device) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (device.uspd_model) {
                await uspdReqeustTime(device)
                return resolve('next')
            }

            const date = new Date()
            if (device.period_type == periodTypeEnum[0]) {
                if (device.days_of_week.includes(date.getDay())) {
                    const hour = device.hours_of_day.find(e => e.hour == date.getHours())
                    if (hour && hour.minutes.includes(minuteConcentrate(date.getMinutes()))) {
                        await responseControllSuccessful(5, device, "3.200.000")
                        return resolve('next')
                    }
                }
            } else {
                if (device.days_of_month.includes(date.getDate())) {
                    const hour = device.hours_of_day.find(e => e.hour == date.getHours())
                    if (hour && hour.minutes.includes(minuteConcentrate(date.getMinutes()))) {
                        await responseControllSuccessful(5, device, "3.200.001")
                        return resolve('next')
                    }
                }
            }

            const message = `Apros vaqti togri kelmadi: Hozir: ${new Date().getTime()}`
            await responseControllStop(5, device, "3.000.000", false, message)
            reject({ message })
        } catch (error) {
            if (device.uspd_model) {
                return reject({ message: error.message || error })
            }

            const message = (error.message || error) + " code: 3.000.001"
            const res = await responseControllStop(5, device, "3.000.001", true, message)
            if (res == 'next') { reject({ message }) }
            else { reject({ message: res }) }
        }
    })
}

function uspdReqeustTime(device) {
    return new Promise(async (resolve, reject) => {
        try {
            const meters = {}

            for (const meter of device.meters) {
                const date = new Date()
                global.steps[meter._id] = global.steps[meter._id] || {}

                if (meter.period_type == periodTypeEnum[0]) {
                    if (meter.days_of_week.includes(date.getDay())) {
                        const hour = meter.hours_of_day.find(e => e.hour == date.getHours())
                        if (hour && hour.minutes.includes(minuteConcentrate(date.getMinutes()))) {
                            await responseControllSuccessful(9, meter, "3.204.000")
                            meters[meter._id] = meter
                        }
                    }
                } else {
                    if (meter.days_of_month.includes(date.getDate())) {
                        const hour = meter.hours_of_day.find(e => e.hour == date.getHours())
                        if (hour && hour.minutes.includes(minuteConcentrate(date.getMinutes()))) {
                            await responseControllSuccessful(9, meter, "3.204.001")
                            meters[meter._id] = meter
                        }
                    }
                }

                if (!meters[meter._id]) {
                    const message = `Apros vaqti togri kelmadi: Hozir: ${new Date().getTime()}, USPD ichida`
                    await responseControllStop(9, meter, "3.002.000", false, message)
                }
            }

            if (Object.values(meters).length) {
                global.uspd_meters[device._id] = Object.values(meters)
                return resolve('next')
            }

            return reject("Uspd ichidagi hamma shotchiklar vaqti togri kelmadi")
        } catch (error) {
            const message = (error.message || error) + " code: 3.002.001"
            for (const meter of device.meters) { await responseControllStop(9, meter, "3.002.001", true, message) }
            reject({ message })
        }
    })
}

module.exports.channelConnection = (channel, device) => {
    return new Promise(async (resolve, reject) => {
        try {
            const requestString = channelConnectionString(channel)
            console.log(requestString, 'Connection-Channel')

            const res = await openPortTcpAndCom(requestString)
            if (res.error) {
                const message = `message: ${res.message}, statue: ${res.status}, code: 2.006.000`
                await responseControllStop(4, device, "3.003.000", false, message)
                return reject({ message })
            }

            await responseControllSuccessful(4, device, "3.205.000")
            global.socket[channel._id] = res.port
            resolve('next')
        } catch (err) {
            const message = (err.message || err) + ', code: 2.005.000'
            const res = await responseControllStop(4, device, "3.003.001", true, message)

            if (res == 'next') { reject({ message }) }
            else { reject({ message: res }) }
        }
    })
}