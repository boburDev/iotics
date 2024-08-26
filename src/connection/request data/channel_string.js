const { channelTCPCategory, channelType, channelGSMCategory, channelConnectionNumber, channelCOMCategory } = require("../../global/enum")

module.exports.channelRequestString = (channel) => {
    const { channel_type, channel_category } = channel

    const defaultData = {
        Id: channel._id,
        ChannelType: channel.channel_type,
        ChannelCategory: channel.channel_category,
        ConnectionNumber: channelConnectionNumber[channel.channel_category],
        InterByteInterval: channel.interbyte_interval,
        ResendCount: channel.resend_count,
        WaitingTime: channel.waiting_time,
        PauseTime: channel.pause_time,
    }

    if (channel_type == channelType[0]) {
        if (channel_category == channelCOMCategory[0]) {
            return {
                ...defaultData,
                StopBit: channel.stop_bit,
                DataBit: channel.data_bit,
                Parity: channel.parity,
                BaudRate: channel.baud_rate,
                Comport: channel.comport
            }
        } else if (channel_category == channelCOMCategory[1]) {
            return {
                ...defaultData,
                StopBit: channel.stop_bit,
                DataBit: channel.data_bit,
                Parity: channel.parity,
                BaudRate: channel.baud_rate,
                Comport: channel.comport,
            }
        }
    } else if (channel_type == channelType[1]) {
        if (channel_category == channelTCPCategory[0]) {
            return { ...defaultData, IpAddress: channel.ip_address, Port: channel.port }
        } else if (channel_category == channelTCPCategory[1]) {
            return { ...defaultData, Port: channel.port }
        } else if (channel_category == channelTCPCategory[2]) {
            return { ...defaultData, IpAddress: channel.ip_address }
        }
    } else if (channel_type == channelType[2]) {
        if (channel_category == channelGSMCategory[0]) {
            return {
                ...defaultData,
                StopBit: channel.stop_bit,
                DataBit: channel.data_bit,
                Parity: channel.parity,
                BaudRate: channel.baud_rate,
                Comport: channel.comport,
                ModemCommand: channel.modem_command,
                ModemPhone: channel.modem_phone
            }
        }
    }
}

module.exports.channelConnectionString = (channel) => {
    const { channel_type, channel_category } = channel

    const defaultData = {
        Id: channel._id,
        ConnectionType: channelConnectionNumber[channel.channel_category],
    }

    if (channel_type == channelType[0]) {
        if (channel_category == channelCOMCategory[0]) {
            return {
                ...defaultData,
                StopBit: channel.stop_bit,
                DataBit: channel.data_bit,
                Parity: channel.parity,
                BaudRate: channel.baud_rate,
                Comport: channel.comport
            }
        } else if (channel_category == channelCOMCategory[1]) {
            return {
                ...defaultData,
                StopBit: channel.stop_bit,
                DataBit: channel.data_bit,
                Parity: channel.parity,
                BaudRate: channel.baud_rate,
                Comport: channel.comport,
            }
        }
    } else if (channel_type == channelType[1]) {
        if (channel_category == channelTCPCategory[0]) {
            return { ...defaultData, IpAddress: channel.ip_address, Port: channel.port }
        } else if (channel_category == channelTCPCategory[1]) {
            return { ...defaultData, Port: channel.port }
        } else if (channel_category == channelTCPCategory[2]) {
            return { ...defaultData, IpAddress: channel.ip_address }
        }
    } else if (channel_type == channelType[2]) {
        if (channel_category == channelGSMCategory[0]) {
            return {
                ...defaultData,
                StopBit: channel.stop_bit,
                DataBit: channel.data_bit,
                Parity: channel.parity,
                BaudRate: channel.baud_rate,
                Comport: channel.comport,
                ModemCommand: channel.modem_command,
                ModemPhone: channel.modem_phone
            }
        }
    }
}