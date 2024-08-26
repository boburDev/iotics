const CustomCatchError = require("../errors/custom_catch_error")
const global = require("./global")
const { newObject } = require("../func/helper_function")
const { connect } = require("../service")
const { controllMessage } = require("./message")
const { requestTime, channelConnection } = require("./requests_check")
const { timeDifferenceChecking, miniArchive } = require("./requests_mini")
const { timeout } = require("../utils/timeouts")
const { responseControllMissed } = require("./utils")

module.exports.startMainLoop = async () => {
    try {
        const channels = await connect.channel.find("2.000.001")

        newObject(channels).forEach(async (channel) => {
            try {
                const onlyMeters = await connect.meter.findOnlyMeter("2.000.002", channel._id)
                const uspd = await connect.uspd.findWithChannel("2.000.003", channel._id)
                channel.devices = [...onlyMeters, ...uspd]

                if (channel.devices.length) {
                    global.controll[String(channel._id)] = controllMessage[2]
                    this.mainLoop(channel)
                } else {
                    global.controll[String(channel._id)] = controllMessage[0]
                }
            } catch (err) {
                const error = new CustomCatchError(err, "2.000.004")
                console.log(error, 'birinchi')
                global.controll[String(channel._id)] = controllMessage[3]
            }
        });
    } catch (err) {
        const error = new CustomCatchError(err, "2.000.000")
        console.log(error, 'ikkinchi')
    }
}

module.exports.mainLoop = async (channel) => {
    try {
        if (global.stop[channel._id] || global.stop.status == 'all') { // BUG await licenseCheck()
            new CustomCatchError({
                only_channel: global.stop[channel._id],
                status: global.stop.status,
                message: global.stop.message || 'License vaqti tugadi'
            }, "2.001.002")
            global.controll[String(channel._id)] = { ...controllMessage[1], message: global.stop.message || 'License vaqti tugadi' }
            return
        }

        for (const device of channel.devices) {
            try {
                global.steps[device._id] = {}

                if (!global.socket[channel._id]) { await channelConnection(channel, device) }
                else { await responseControllMissed(4, device, "3.706.000", "Connection bor") }

                await requestTime(device)
                    .then(() => timeDifferenceChecking(channel, device))
                    .then(() => miniArchive(channel, device))
                    .then(console.log)
            } catch (err) {
                const error = new CustomCatchError({ channel: channel._id, device: device._id, err: err.message }, "2.001.001")
                console.log(error, 'mainLoop for')
            }
        }

        // timeout(() => { this.mainLoop(channel) }, 5000, "2.001.003");
    } catch (err) {
        const error = new CustomCatchError(err, "2.001.000")
        console.log(error, 'MainLoop')
        timeout(() => { this.mainLoop(channel) }, 5000, "2.001.004");
    }
}
