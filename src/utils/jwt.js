const crypto = require('crypto');
require('dotenv').config();
const CustomError = require('../errors/custom_error');

function toHex(str) {
    return Buffer.from(str, 'utf8').toString('hex');
}

function fromHex(hex) {
    return Buffer.from(hex, 'hex').toString('utf8');
}

function createSignature(data, secret) {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

function generateSecretKey() {
    const hexChars = '0123456789abcdef';
    let secretKey = '';
    for (let i = 0; i < 64; i++) {
        secretKey += hexChars[Math.floor(Math.random() * hexChars.length)];
    }
    return secretKey;
}

function verifyToken(token, secret) {
    const [encodedPayload, receivedSignature] = token.split('.');
    const expectedSignature = createSignature(encodedPayload, secret);

    if (expectedSignature === receivedSignature) {
        const payloadString = fromHex(encodedPayload);
        return JSON.parse(payloadString);
    } else {
        throw new CustomError({ token, secret }, "0.011.001");
    }
}

function generateToken(payload, secret) {
    const payloadString = JSON.stringify(payload);
    const encodedPayload = toHex(payloadString);
    const signature = createSignature(encodedPayload, secret);
    return `${encodedPayload}.${signature}`;
}

function sign(data, id, module='') {
    try {
        const secret = generateSecretKey();
        const datas = { ...data, exp: new Date() };
        const step1 = generateToken(datas, secret);
        const token = generateToken({ token: step1, id, module }, process.env.SECRET);

        return {
            token,
            secret
        };
    } catch (error) {
        console.log(error)
        throw new CustomError({ data, id, error }, "0.011.000");
    }
}

async function verify(token, key = process.env.SECRET) {
    try {
        return verifyToken(token, key);
    } catch (error) {
        console.log(error)
        throw new CustomError(error, "0.011.002");
    }
}

module.exports = {
    sign,
    verify
};
