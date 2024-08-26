const CustomError = require("../errors/custom_error")

module.exports.getJson = (theSource) => {
    try {
        // BUG shu yerda olinvoti deme shu yerni ozida fs.stat bilan bazani tekshirib oladigan joyini ham qoshish kerakmikin ?

        const file = require(`../jsons/${theSource}.json`)
        return file
    } catch (error) {
        return new CustomError(error, "1.000.000")
    }
}