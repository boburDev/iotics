const CustomCatchError = require("../errors/custom_catch_error");

module.exports.timeout = (callback, minute, error_code) => {
    return new Promise((resolve, reject) => {
        const time = setTimeout(() => {
            try {
                clearTimeout(time)
                callback()
                resolve('ok')
            } catch (err) {
                console.log('Error timeout ichidan chiqdi: ', err)
                new CustomCatchError(err, error_code)
                resolve(err)
            }
        }, minute);
    })
}

module.exports.interval = (callback, minute, error_code) => {
    return new Promise((resolve, reject) => {
        const time = setTimeout(() => {
            try {
                clearTimeout(time)
                callback()
                resolve('ok')
            } catch (err) {
                console.log('Error interval ichidan chiqdi: ', err)
                new CustomCatchError(err, error_code)
                resolve(err)
            }
        }, minute);
    })
}