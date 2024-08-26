const CustomError = require("../errors/custom_error")
const { getJson } = require("./get_json")

module.exports.permissionGlobal = (role, bool) => {
    try {
        const trusted = bool ? "trusted" : "untrusted"
        const file = getJson(`permission/${role}`)
        return file[trusted]
    } catch (error) {
        throw new CustomError(error, "1.000.000")
    }
}