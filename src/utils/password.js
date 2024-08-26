const crypto = require('crypto');

module.exports.passwordHash = function (password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
};

module.exports.passwordValidate = function(password, hashedPassword) {
    const [salt, originalHash] = hashedPassword.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return hash == originalHash;
};
