const error = require('./message.json')

function ErrorHandler(data, opt = {}) {
    console.log('ERROR: ', data, opt);
    // if (typeof data !== 'number' && error[data.status]) {
    //     return {
    //         data: null,
    //         error: true,
    //         message: `${opt.ip} | ${error[data.status]} | ${data.message}`,
    //         body: {
    //             status: data.status,
    //             ...(data.attempted && {attempted: data.attempted}),
    //             ...(data.obis && {obis: data.obis})
    //         }
    //     }
    // } else if (typeof data === 'number') {
    //     return {
    //         data: null,
    //         error: true,
    //         message: `${opt.ip} | ${error[data]}`,
    //         body: {
    //             status: data,
    //             obis: 'lst',
    //         }
    //     }
    // } else {
    //     return { data: null, message: `${opt.ip} | ${data.message}`, status: 110, error: true }
    // }
}

module.exports = ErrorHandler
