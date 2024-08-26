const CustomCatchError = require("../../errors/custom_catch_error")
const { connect } = require("../../service")

module.exports.defaultData = async () => {
    try {
        const find = await connect.folder.find("0.033.001")
        if (!find) { await connect.folder.create("0.033.001", { folder: "", elect: "", calc: "" }) }
    } catch (error) {
        new CustomCatchError(error, "0.033.000")
    }
}