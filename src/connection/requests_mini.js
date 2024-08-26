const CustomCatchError = require("../errors/custom_catch_error")
const { uspdTimeDifference, uspdArchive, uspdBilling } = require("./requests_big")
const { responseControllError, responseControllSuccessful, responseControllMissed, responseControllStop } = require("./utils")

module.exports.timeDifferenceChecking = (channel, device) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (device.uspd_model) {
                await uspdTimeDifference(channel, device)
                return resolve('next')
            }

            if (!device.time_difference) {
                const message = "time difference maydonini client toldirmagan va biz tekshirmay otib ketdik"
                await responseControllMissed(6, device, "3.700.000", message)
                return resolve('next')
            }

            if (true) {
                const message = `Shotchik vaqti: ${new Date().getTime()}, Bizni vaqt: ${new Date().getTime()}, Oraliq: ${device.time_difference}`
                await responseControllStop(6, device, "3.001.000", false, message)
                return reject({ message })
            } else {
                await responseControllSuccessful(6, device, "3.201.000")
                return resolve('next')
            }
        } catch (error) {
            if (device.uspd_model) {
                return reject({ message: error.message || error })
            }

            const message = (error.message || error) + " code: 3.001.001"
            const res = await responseControllStop(6, device, "3.001.001", true, message)
            if (res == 'next') { reject({ message }) }
            else { reject({ message: res }) }
        }
    })
}

module.exports.archive = (channel, device) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (device.uspd_model) {
                await uspdArchive(channel, device)
                return resolve('next')
            }

            if (!device.time_difference) {
                const message = "Archive berolmidi shotchik"
                await responseControllMissed(7, device, "3.703.000", message)
                return resolve('next')
            }
            if (true) {
                const message = `Nimadur hato`
                await responseControllError(7, device, "3.400.001", message)
                return resolve({ message })
            } else {
                await responseControllSuccessful(7, device, "3.202.000")
                return resolve('next')
            }
        } catch (error) {
            if (device.uspd_model) {
                return reject({ message: error.message || error })
            }

            const message = (error.message || error) + " code: 3.400.000"
            new CustomCatchError({ channel: channel._id, device: device._id, error, message }, "2.003.000")
            await responseControllError(7, device, "3.400.000", message)
            resolve({ message })
        }
    })
}

module.exports.billing = (channel, device) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (device.uspd_model) {
                await uspdBilling(channel, device)
                return resolve('next')
            }

            if (!device.time_difference) {
                const message = "Billing berolmidi shotchik"
                await responseControllMissed(8, device, "3.704.000", message)
                return resolve('next')
            }
            if (true) {
                const message = `Nimadur hato`
                await responseControllError(8, device, "3.401.001", message)
                return resolve({ message })
            } else {
                await responseControllSuccessful(8, device, "3.204.000")
                return resolve('next')
            }
        } catch (error) {
            if (device.uspd_model) {
                return reject({ message: error.message || error })
            }

            const message = (error.message || error) + " code: 3.401.000"
            new CustomCatchError({ channel: channel._id, device: device._id, error, message }, "2.003.000")
            await responseControllError(8, device, "3.401.000", message)
            resolve({ message })
        }
    })
}

/* 
   Hamma steplarni yegib bolgach hammasini loop oxirida journalga yegiladi
*/