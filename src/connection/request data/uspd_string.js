const { protocolUSPDEnum } = require("../../global/enum")

module.exports.uspdRequestString = (uspd) => {
    const { protocol } = uspd

    if (protocol == protocolUSPDEnum[0] || protocol == protocolUSPDEnum[1]) {
        return {
            UspdAddress: uspd.connection_address,
            Protocol: protocol,
        }
    } else if (protocol == protocolUSPDEnum[2]) {
        return {
            Login: uspd.login,
            Password: uspd.password,
            Protocol: protocol,
        }
    }
}