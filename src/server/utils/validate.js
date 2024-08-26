const Joi = require('joi');
const meters = ['CE_308']
const { commMediaValues, meterProtocols } = require('./enums')

function validateMeterTcpClient(input, key) {
    const schema = Joi.object().keys({
        Id: Joi.string().required(),
        ...(key == 'meter' && {
            DeviceType: Joi.string().required(),
            DeviceModel: Joi.string().valid(...meters).required(),
            DeviceAddress: Joi.string().required(),
            DevicePassword: Joi.string(),
            DeviceProtocol: Joi.string(),
            ResendCount: Joi.number().required(),
            WaitingTime: Joi.number().required(),
            PauseTime: Joi.number().required(),
            RegisterCode: Joi.array().items(Joi.string()).required(),
            RegisterTime: Joi.object({
                date1: Joi.string().required(),
                date2: Joi.string().required()
            })
        }),
        ConnectionType: Joi.number().required().valid(1).required(),
        IpAddress: Joi.string().required(),
        Port: Joi.string().required(),
    });
    return schema.validate(input);
};

function validateMeterTcpServer(input, key) {
    const schema = Joi.object().keys({
        Id: Joi.string().required(),
        ...(key == 'meter' && {
            DeviceType: Joi.string().required(),
            DeviceModel: Joi.string().valid(...meters),
            DeviceAddress: Joi.string().required(),
            DevicePassword: Joi.string(),
            DeviceProtocol: Joi.string(),
            ResendCount: Joi.number().required(),
            WaitingTime: Joi.number().required(),
            PauseTime: Joi.number().required(),
            RegisterCode: Joi.array().items(Joi.string()).required(),
            RegisterTime: Joi.object({
                date1: Joi.string().required(),
                date2: Joi.string().required()
            })
        }),
        ConnectionType: Joi.number().required().valid(2).required(),
        Port: Joi.number().required(),
    });
    return schema.validate(input);
};

function validateMeterOptical(input, key) {
    const schema = Joi.object().keys({
        Id: Joi.string().required(),
        ...(key == 'meter' && {
            DeviceType: Joi.string().required(),
            DeviceModel: Joi.string().valid(...meters).required(),
            DeviceAddress: Joi.string().required(),
            DevicePassword: Joi.string().required(),
            DeviceProtocol: Joi.string(),
            InterByteInterval: Joi.string().required(),
            PackageSize: Joi.string().required(),
            ResendCount: Joi.number().required(),
            WaitingTime: Joi.number().required(),
            PauseTime: Joi.number().required(),
            RegisterCode: Joi.array().items(Joi.string()).required(),
            RegisterTime: Joi.object({
                date1: Joi.string().required(),
                date2: Joi.string().required()
            })
        }),
        ConnectionType: Joi.number().required().valid(4).required(),
        Comport: Joi.string().required(),
        BaudRate: Joi.string().required(),
        DataBit: Joi.string().required(),
        StopBit: Joi.string().required(),
        Parity: Joi.string().required(),
    });
    return schema.validate(input);
};

function validateMeterConverter(input, key) {
    const schema = Joi.object().keys({
        Id: Joi.string().required(),
        ...(key == 'meter' && {
            DeviceType: Joi.string().required(),
            DeviceModel: Joi.string().valid(...meters).required(),
            DeviceAddress: Joi.string().required(),
            DevicePassword: Joi.string().required(),
            DeviceProtocol: Joi.string(),
            InterByteInterval: Joi.string().required(),
            ResendCount: Joi.number().required(),
            WaitingTime: Joi.number().required(),
            PauseTime: Joi.number().required(),
            RegisterCode: Joi.array().items(Joi.string()).required(),
            RegisterTime: Joi.object({
                date1: Joi.string().required(),
                date2: Joi.string().required()
            })
        }),
        ConnectionType: Joi.number().required().valid(5).required(),
        Comport: Joi.string().required(),
        BaudRate: Joi.string().required(),
        DataBit: Joi.string().required(),
        StopBit: Joi.string().required(),
        Parity: Joi.string().required(),
    });
    return schema.validate(input);
};

function validateMeterGSM(input, key) {
    const schema = Joi.object().keys({
        Id: Joi.string().required(),
        ...(key == 'meter' && {
            DeviceType: Joi.string().required(),
            DeviceModel: Joi.string().valid(...meters).required(),
            DeviceAddress: Joi.string().required(),
            DevicePassword: Joi.string().required(),
            DeviceProtocol: Joi.string(),
            InterByteInterval: Joi.string().required(),
            ResendCount: Joi.number().required(),
            WaitingTime: Joi.number().required(),
            PauseTime: Joi.number().required(),
            RegisterCode: Joi.array().items(Joi.string()).required(),
            RegisterTime: Joi.object({
                date1: Joi.string().required(),
                date2: Joi.string().required()
            })
        }),
        ConnectionType: Joi.number().required().valid(6).required(),
        Comport: Joi.string().required(),
        BaudRate: Joi.string().required(),
        DataBit: Joi.string().required(),
        StopBit: Joi.string().required(),
        Parity: Joi.string().required(),
        ModemCommand: Joi.string().required(),
        ModemPhone: Joi.string().required(),
    });
    return schema.validate(input);
};

function validateMeterInputs(objectInput, key) {
    if (objectInput && objectInput.ConnectionType == 1) {
        return validateMeterTcpClient(objectInput, key)
    } else if (objectInput && objectInput.ConnectionType == 2) {
        return validateMeterTcpServer(objectInput, key)
    } else if (objectInput && objectInput.ConnectionType == 3) {
        return 'peer_to_peer not compleated'
    } else if (objectInput && objectInput.ConnectionType == 4) {
        return validateMeterOptical(objectInput, key)
    } else if (objectInput && objectInput.ConnectionType == 5) {
        return validateMeterConverter(objectInput, key)
    } else if (objectInput && objectInput.ConnectionType == 6) {
        return validateMeterGSM(objectInput, key)
    }
}

module.exports = {
    validateMeterInputs
}
