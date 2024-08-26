const { default: mongoose } = require("mongoose")
const CustomError = require("../../errors/custom_error")
const { sessionType, adminRolesList } = require("../../global/enum")
const { permissionGlobal } = require("../../global/permission")
const { adminModel, sessionsModel } = require("../../models")

module.exports = {
    async findAll(code, adminRole, sessionId) {
        try {
            const session = await sessionsModel.findById(sessionId)
            const admin = permissionGlobal(adminRole, session.type == sessionType[0])

            return await adminModel.aggregate([
                {
                    $lookup: {
                        from: "sessions",
                        localField: "_id",
                        foreignField: "admin_id",
                        as: "session"
                    }
                }, {
                    $match: {
                        role: { $in: admin.all.admin }
                    }
                }, {
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        active: { $first: "$active" },
                        role: { $first: "$role" },
                        session: {
                            $push: {
                                _id: { $first: "$session._id" },
                                application_name: { $first: "$session.application_name" },
                                application_version: { $first: "$session.application_version" },
                                location: { $first: "$session.location" },
                                type: { $first: "$session.type" },
                                last_active: { $first: "$session.last_active" },
                                uuid: { $first: "$session.uuid" },
                                os: { $first: "$session.os" }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        session: {
                            $cond: { if: { $eq: ["$session", [{}]] }, then: [], else: "$session" }
                        }
                    }
                }
            ])
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    async findWithId(code, adminRole, sessionId, id) {
        try {
            const session = await sessionsModel.findById(sessionId)
            const admin = permissionGlobal(adminRole, session.type == sessionType[0])

            return (await adminModel.aggregate([
                {
                    $lookup: {
                        from: "sessions",
                        localField: "_id",
                        foreignField: "admin_id",
                        as: "session"
                    }
                }, {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id),
                        role: { $in: admin.all.admin }
                    }
                }, {
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        active: { $first: "$active" },
                        role: { $first: "$role" },
                        session: {
                            $push: {
                                _id: { $first: "$session._id" },
                                application_name: { $first: "$session.application_name" },
                                application_version: { $first: "$session.application_version" },
                                location: { $first: "$session.location" },
                                type: { $first: "$session.type" },
                                last_active: { $first: "$session.last_active" },
                                uuid: { $first: "$session.uuid" },
                                os: { $first: "$session.os" }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        session: {
                            $cond: { if: { $eq: ["$session", [{}]] }, then: [], else: "$session" }
                        }
                    }
                }
            ]))[0]
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    async findOne(code, args) {
        try {
            const find = await adminModel.findOne(args)

            if (find && find.active) {
                return find
            } else {
                return undefined
            }
        } catch (error) {
            throw new CustomError({ args, error: error.message }, code)
        }
    },
    async findActive(code, args) {
        try {
            const find = await adminModel.findOne(args)

            if (find && find.active) {
                return find
            } else {
                return undefined
            }
        } catch (error) {
            throw new CustomError({ args, error: error.message }, code)
        }
    },
    async findSuperAdminCount(code) {
        try {
            return await adminModel.countDocuments({ role: adminRolesList[0], active: true })
        } catch (error) {
            throw new CustomError(error, code)
        }
    },
    async findReactive(code, args) {
        try {
            const find = await adminModel.findOne(args)

            if (find && !find.active) {
                return find
            } else {
                return undefined
            }
        } catch (error) {
            throw new CustomError({ args, error: error.message }, code)
        }
    },
    async create(code, args) {
        try {
            return await adminModel.create(args)
        } catch (error) {
            throw new CustomError({ args, error: error.message }, code)
        }
    },
    async update(code, _id, args) {
        try {
            return await adminModel.updateOne({ _id }, args)
        } catch (error) {
            throw new CustomError({ args, error: error.message }, code)
        }
    },
    async remove(code, id) {
        try {
            await adminModel.updateOne({ _id: id }, { active: false })
        } catch (error) {
            throw new CustomError({ id, error: error.message }, code)
        }
    },
    async activate(code, id) {
        try {
            await adminModel.updateOne({ _id: id }, { active: true })
        } catch (error) {
            throw new CustomError({ id, error: error.message }, code)
        }
    },
    async superAdminDelete(code) {
        try {
            await adminModel.deleteMany({ role: adminRolesList[0] })
        } catch (error) {
            throw new CustomError(error, code)
        }
    }
}