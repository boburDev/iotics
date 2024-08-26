const global = require("./global")
const { newObject } = require("../func/helper_function")
const { controllMessage } = require("./message")
const { stepsList } = require("../global/variable")
const { connect } = require("../service")
const { stateList } = require("../global/enum")

module.exports.responseControllStop = (index, device, code, inCatch, message = "") => {
    return new Promise(async (resolve, reject) => {
        try {
            const { channel_id, _id, meter_type } = device
            const devices = global.controll[channel_id].devices || {}
            const controll = newObject(controllMessage[index])

            global.controll[channel_id] = {
                ...controll,
                devices: { ...devices, [_id]: { message, active: false, status: stateList[1], step: controll.status } }
            }

            const obj = {
                "3.000.000": "3.701.000",
                "3.000.001": "3.701.001",
                "3.001.000": "3.702.000",
                "3.001.001": "3.702.001",
                "3.002.000": "3.705.000",
                "3.002.001": "3.705.001",
                "3.003.000": "3.706.001",
                "3.003.001": "3.706.002"
            }

            console.log(controll)
            global.steps[_id][controll.status] = { step: controll.status, step_code: code, step_time: new Date() }
            stepsList.map(e => {
                if (!global.steps[_id][e]) {
                    global.steps[_id][e] = { step: e, step_code: obj[code], step_time: new Date() }
                }
            })

            await this.journalCreateOrUpdate({
                device_id: _id,
                device_type: meter_type,
                date: this.todayFormat(new Date()),
                poll_log: [
                    {
                        state: stateList[1],
                        poll_type: controll.where,
                        steps: Object.values(global.steps[_id])
                    }
                ]
            })

            // console.log(global.steps[_id], 'Stop')
            console.log(global.controll[channel_id], 'Stop')
            resolve('next')
        } catch (error) {
            console.log(error, 'shu yerda')
            const msg = `state: Stop, args_code: ${code}, message: ${error.message},`
            if (inCatch) { resolve(msg) }
            else { reject(msg) }
        }
    })
}

module.exports.responseControllError = (index, device, code, message = "") => {
    return new Promise(async (resolve, reject) => {
        try {
            const { channel_id, _id } = device
            const devices = global.controll[channel_id].devices || {}
            const controll = newObject(controllMessage[index])

            global.steps[_id][controll.status] = { step: controll.status, step_code: code, step_time: new Date() }
            global.controll[channel_id] = {
                ...controll,
                devices: { ...devices, [_id]: { message, active: true, status: stateList[1], step: controll.status } }
            }

            // console.log(global.steps[_id], 'Error')
            console.log(global.controll[channel_id], 'Error')
            resolve('')
        } catch (error) {
            const msg = `state: Error, args_code: ${code}, message: ${error.message},`
            resolve(msg)
        }
    })
}

module.exports.responseControllSuccessful = async (index, device, code) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { channel_id, _id } = device
            const devices = global.controll[channel_id].devices || {}
            const controll = newObject(controllMessage[index])

            global.steps[_id][controll.status] = { step: controll.status, step_code: code, step_time: new Date() }
            global.controll[channel_id] = {
                ...controll,
                devices: { ...devices, [_id]: { active: true, status: stateList[0], step: controll.status } }
            }

            // console.log(global.steps[_id], stateList[0])
            console.log(global.controll[channel_id], stateList[0])
            resolve('')
        } catch (error) {
            const msg = `state: Successful, args_code: ${code}, message: ${error.message},`
            reject(msg)
        }
    })
}

module.exports.responseControllMissed = (index, device, code, message = "") => {
    return new Promise(async (resolve, reject) => {
        try {
            const { channel_id, _id } = device
            const devices = global.controll[channel_id].devices || {}
            const controll = newObject(controllMessage[index])

            global.steps[_id][controll.status] = { step: controll.status, step_code: code, step_time: new Date() }
            global.controll[channel_id] = {
                ...controll,
                devices: { ...devices, [_id]: { active: true, status: stateList[2], message, step: controll.status } }
            }

            // console.log(global.steps[_id], stateList[2])
            console.log(global.controll[channel_id], stateList[2])
            resolve('')
        } catch (error) {
            const msg = `state: Missed, args_code: ${code}, message: ${error.message},`
            reject(msg)
        }
    })
}

module.exports.minuteConcentrate = (num) => {
    return Math.floor(num / 5) * 5;
}

module.exports.responseChecking = (res) => {
    return new Promise((resolve, reject) => {
        if (typeof res == 'object') {
            if (res.status == 'next') { resolve(res) }
            else { reject(res) }
        } else {
            if (res == 'next') { resolve(res) }
            else { reject(res) }
        }
    })
}

module.exports.journalCreateOrUpdate = async (args) => {
    const { device_id, date } = args
    const journal = global.journal[device_id] || {}

    if (journal && journal.date - date == 0) {
        const { journal_id } = journal
        await update(journal_id)
    } else {
        const find = await connect.journal.findOne("2.002.000", device_id, date)
        if (find) {
            global.journal[device_id] = { date, journal_id: find._id }
            await update(find._id)
        } else {
            const newJournal = await connect.journal.create("2.002.001", args)
            global.journal[device_id] = { date, journal_id: newJournal._id }
        }
    }

    async function update(journal_id) {
        const { poll_log } = args
        await connect.journal.update('2.002.002', journal_id, { $push: { poll_log: poll_log[0] } })
    }
}

module.exports.todayFormat = (date) => {
    const today = new Date(date)
    today.setHours(0, 0, 0, 0)
    return today
}