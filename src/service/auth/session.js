const CustomError = require("../../errors/custom_error")
const { sessionType } = require("../../global/enum")
const { sessionsModel } = require("../../models")
const { sign } = require("../../utils/jwt")

module.exports = {
    async checkSession(admin, application_name, application_version, location, uuid, os) {
        try {
            const find = await sessionsModel.findOne({ admin_id: admin._id, uuid, os })

            if (find) {
                if (find.type == sessionType[0]) {
                    return this.tokenAndUpdateSession(admin.role, application_name, find)
                } else {
                    let type = sessionType[1]
                    if (find.createdAt - new Date() >= 10 * 24 * 60 * 60 * 1000) {
                        type = sessionType[0]
                    }

                    return this.tokenAndUpdateSession(admin.role, application_name, find, { type })
                }
            } else {
                const finds = await sessionsModel.countDocuments()
                if (finds == 0) {
                    const newCreate = await sessionsModel.create({
                        type: sessionType[0],
                        application_name,
                        application_version,
                        location,
                        admin_id: admin._id,
                        uuid,
                        os
                    })

                    return this.tokenAndUpdateSession(admin.role, application_name, newCreate)
                } else {
                    const newCreate = await sessionsModel.create({
                        type: sessionType[1],
                        application_name,
                        application_version,
                        admin_id: admin._id,
                        location,
                        uuid,
                        os
                    })

                    return this.tokenAndUpdateSession(admin.role, application_name, newCreate)
                }
            }
        } catch (error) {
            throw new CustomError({
                admin,
                application_name,
                application_version,
                location,
                uuid,
                os,
                error: error.message
            }, "0.005.004")
        }
    },
    async tokenAndUpdateSession(role, module, findSession, args = {}) {
        try {
            const data = {
                id: findSession.admin_id,
                session: findSession._id,
                role
            }

            const { token: refresh, secret: refresh_key } = sign(data, findSession._id)
            const { token: access, secret: access_key } = sign(data, findSession._id, module)

            await sessionsModel.updateOne({ _id: findSession._id }, {
                last_active: new Date(),
                refresh: new Date(),
                [module + '_access']: {
                    access: new Date(),
                    access_key,
                },
                refresh_key,
                ...args
            })

            return { refresh, access, type: findSession.type }
        } catch (error) {
            throw new CustomError({
                role,
                findSession,
                args,
                error: error.message
            }, "0.005.005")
        }
    },
    async findById(id) {
        try {
            return sessionsModel.findById(id)
        } catch (error) {
            throw new CustomError({ error, id }, "0.008.008")
        }
    },
    async findOne(args) {
        try {
            return sessionsModel.findOne(args)
        } catch (error) {
            throw new CustomError({ ...args, error }, "0.008.009")
        }
    },
    async update(_id, args) {
        try {
            await sessionsModel.updateOne({ _id }, args)
        } catch (error) {
            throw new CustomError({ error, _id, ...args }, "0.008.010")
        }
    },
    async delete(_id) {
        try {
            await sessionsModel.deleteOne({ _id })
        } catch (error) {
            throw new CustomError({ error, _id }, "0.008.011")
        }
    }
}