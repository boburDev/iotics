const { stepsList } = require("../global/variable");

module.exports.controllMessage = {
    0: { where: "stop", active: false, message: "" },
    1: { where: "stop", active: false, message: "" },
    2: { where: "start", active: true, message: "startMiddleware to MainLoop" },
    3: { where: "error", active: false, message: "" },
    4: { where: "loop", status: stepsList[0], active: true, form: "channel" },
    5: { where: "loop", status: stepsList[1], active: true, form: "meter" },
    6: { where: "loop", status: stepsList[2], active: true, form: "meter" },
    7: { where: "loop", status: stepsList[3], active: true, form: "meter" },
    8: { where: "loop", status: stepsList[4], active: true, form: "meter" },
    9: { where: "loop", status: stepsList[1], active: true, form: "uspd" },
}
