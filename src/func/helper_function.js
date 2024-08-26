const { handshakeLetters } = require("../global/variable");

module.exports.newObject = (obj) => {
    if (typeof obj == 'object') {
        return JSON.parse(JSON.stringify(obj))
    }
    return obj
}

module.exports.nullOrUndefined = (value) => {
    return value === null || value === undefined;
}

module.exports.generateRandomString = function (length) {
    const letters = handshakeLetters;

    let result = '';
    const lettersLength = letters.length;
    for (let i = 0; i < length; i++) {
        result += letters.charAt(Math.floor(Math.random() * lettersLength));
    }
    return result;
}
