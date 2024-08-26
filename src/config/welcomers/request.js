const CustomError = require("../../errors/custom_error")

module.exports.RequestBody = (args, schema) => {
    try {
        const { error, value } = schema.validate(args[0].body)
        if (error) {
            throw new CustomError(error, "0.001.000")
        }

        return value
    } catch (error) {
        throw new CustomError(error, "0.001.000")
    }
}

module.exports.RequestData = (args, ...variables) => {
    try {
        const body = args[0].body
        for (const variable of variables) {
            if(!(variable in body)) {
                throw new CustomError(`${variable} is required`, "0.001.000")
            }
        }

        return body
    } catch (error) {
        throw new CustomError(error, "0.001.000")
    }
}

module.exports.RequestQuery = (args, schema) => {
    try {
        const { error, value } = schema.validate(args[0].query)
        if (error) {
            throw new CustomError(error, "0.001.000")
        }

        return value
    } catch (error) {
        throw new CustomError(error, "0.001.000")
    }
}

module.exports.RequestParams = (args) => {
    return args[0].params
}

module.exports.RequestToken = (args) => {
    return { admin: args[0].admin, session: args[0].session, role: args[0].role }
}