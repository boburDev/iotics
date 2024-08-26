const { SerialPort } = require('serialport');
const { Socket, createServer } = require('net');

function connectionConfig(params) {
    try {
        let port
        if (params && params.ConnectionType == 1) {
            port = new Socket()
            port['settings'] = {
                host: params.IpAddress,
                port: params.Port
            }
            return port
        } else if (params && ['4', '5', '6'].includes(params.ConnectionType)) {
            port = new SerialPort({
                path: params.Comport,
                baudRate: params.BaudRate,
                dataBits: params.DataBit,
                stopBits: params.StopBit,
                parity: params.Parity,
                autoOpen: false,
            })
            return port
        }
    } catch (error) {
        if (Number(error.message)) {
            return {
                error: true,
                status: error.message,
                index: 5
            }
        } else {
            return {
                error: true,
                status: 110,
                message: error && error.message,
                index: 5
            }
        }
    }
}

function meterOptions(data) {

    let connectionType = data.ConnectionType
    return {
        Id: data.Id,
        ConnectionType: connectionType,
        DeviceType: data.DeviceType,
        DeviceModel: `${data.DeviceModel}${data.DeviceProtocol && data.DeviceProtocol.length ? `_${data.DeviceProtocol}` : ''}`,
        DeviceShortName: data.DeviceModel.split('_')[0],
        DeviceAddress: data.DeviceAddress,
        DevicePassword: data.DevicePassword,
        DeviceProtocol: data.DeviceProtocol,
        ResendCount: data.ResendCount,
        WaitingTime: data.WaitingTime,
        PauseTime: data.PauseTime,
        obis: data.RegisterCode,
        ...(data.RegisterTime && { date: data.RegisterTime }),
        ...(['4', '5', '6'].includes(connectionType) && {
            interval: data.InterByteInterval,
            maxBufferSize: data.PackageSize
        }),
        options: {
            ...(data.IpAddress && { IpAddress: data.IpAddress }),
            ...(data.Port && { Port: data.Port }),
            ...(data.Comport && { Comport: data.Comport }),
            ...(data.BaudRate && { BaudRate: data.BaudRate }),
            ...(data.DataBit && { DataBit: data.DataBit }),
            ...(data.StopBit && { StopBit: data.StopBit }),
            ...(data.Parity && { Parity: data.Parity }),
            ...(data.ModemCommand && { ModemCommand: data.ModemCommand }),
            ...(data.ModemPhone && { ModemPhone: data.ModemPhone }),
            ip: `${data.DeviceModel}${data.DeviceProtocol && data.DeviceProtocol.length ? `_${data.DeviceProtocol}` : ''} - ${data.DeviceAddress}`
        }
    }
}

module.exports = {
    connectionConfig,
    meterOptions
}
