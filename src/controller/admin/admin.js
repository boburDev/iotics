const CustomError = require("../../errors/custom_error")
const { RequestBody, RequestToken, RequestParams } = require("../../config/welcomers/request")
const { ResponseError, Response } = require("../../config/welcomers/response")
const { adminCreateValidate, adminUpdateValidate, adminCreateAdminValidate, profileUpdateValidate } = require("../../validation/admin/admin")
const { loginChecking, passwordChecking } = require("../../validation/auth/custom")
const { sessionType, adminRolesList } = require("../../global/enum")
const { permissionGlobal } = require("../../global/permission")
const { connect } = require("../../service")
const { passwordHash } = require("../../utils/password")
const { handshakeObj } = require("../auth/auth")
const { informationValidate } = require("../../validation/auth/auth")

module.exports.createAdmin = async (...args) => {
    try {
        const { name, password, login, role } = RequestBody(args, adminCreateValidate)
        const { role: admin_role, admin, session } = RequestToken(args)

        loginChecking(login, "0.018.002")
        passwordChecking(password, "0.018.003")

        if (await permissionCreate(role, admin_role, session)) {
            const newUser = await connect.admin.create("0.018.004", { name, password: passwordHash(password), login, role })
            await connect.history.create({
                role: admin_role,
                message: `${admin_role} ${role} ni qo'shdi`,
                id: newUser._id,
                admin,
                session
            })

            return Response(args, "Successful created", 201)
        } else {
            return ResponseError(args, { role, admin_role }, "0.018.001")
        }
    } catch (error) {
        return ResponseError(args, error, "0.018.000")
    }
}

module.exports.createSuperAdmin = async (...args) => {
    try {
        const { password, login, key } = RequestBody(args, adminCreateAdminValidate)

        if (!handshakeObj[key]) { return ResponseError(args, { handshakeObj, key }, "0.027.004") }
        delete handshakeObj[key]

        loginChecking(login, "0.027.001")
        passwordChecking(password, "0.027.002")

        const count = await connect.admin.findSuperAdminCount("0.027.005")
        if (count) { return ResponseError(args, { count }, "0.027.003") }

        await connect.admin.create("0.027.006", { password: passwordHash(password), login, role: adminRolesList[0] })
        return Response(args, "Successful created", 201)
    } catch (error) {
        return ResponseError(args, error, "0.027.000")
    }
}

module.exports.findAdmins = async (...args) => {
    try {
        const { role: admin_role, session } = RequestToken(args)

        return Response(args, await connect.admin.findAll("0.021.001", admin_role, session))
    } catch (error) {
        return ResponseError(args, error, "0.021.000")
    }
}

module.exports.findOneAdmin = async (...args) => {
    try {
        const { role: admin_role, session } = RequestToken(args)
        const { id } = RequestParams(args)

        return Response(args, await connect.admin.findWithId("0.021.001", admin_role, session, id))
    } catch (error) {
        return ResponseError(args, error, "0.022.000")
    }
}

module.exports.updateProfile = async (...args) => {
    try {
        let { name, password, login, block, notification_mute } = RequestBody(args, profileUpdateValidate)
        const { role: admin_role, admin, session } = RequestToken(args)

        const find = await connect.admin.findOne("0.028.005", { _id: admin })
        if (!find) { return ResponseError(args, { admin }, "0.028.001") }
        if (!find.active) { return ResponseError(args, { find }, "0.028.002") }

        const findSession = await connect.session.findById(session)
        if (!findSession) { return ResponseError(args, { admin }, "0.028.003") }

        if (block && findSession.type != sessionType[0]) {
            return ResponseError(args, { find }, "0.028.004")
        }

        const newObj = {
            name: name || find.name,
            password: password ? passwordHash(password) : find.password,
            login: login || find.login,
            block: block || find.block,
            notification_mute: notification_mute.length ? notification_mute : find.notification_mute,
        }

        await connect.admin.update("0.028.006", admin, newObj)
        await connect.history.create({
            role: admin_role,
            message: `${admin_role} o'zini ni o'zgartirdi`,
            admin, session
        })
        return Response(args, "Successful updated", 200)
    } catch (error) {
        return ResponseError(args, error, "0.028.000")
    }
}

module.exports.updateAdmin = async (...args) => {
    try {
        let { name, password, login, role, forgot_password, notification_type } = RequestBody(args, adminUpdateValidate)
        const { role: admin_role, admin, session } = RequestToken(args)
        const { id } = RequestParams(args)

        const find = await connect.admin.findOne("0.022.001", { _id: id })
        if (!find) { return ResponseError(args, { id }, "0.022.002") }

        if (!find.active) { return ResponseError(args, { find }, "0.022.003") }
        if (!role) { role = find.role }

        if (await permissionUpdate(role, find.role, admin_role, session)) {
            const newObj = {
                name: name || find.name,
                password: password ? passwordHash(password) : find.password,
                login: login || find.login,
                role: role || find.role,
                notification_type: notification_type.length ? notification_type : find.notification_type,
                forgot_password: forgot_password || find.forgot_password
            }

            await connect.admin.update("0.022.005", id, newObj)
            await connect.history.create({
                role: admin_role,
                message: `${admin_role} ${role} ni o'zgartirdi`,
                admin, session, id
            })
            return Response(args, "Successful updated", 200)
        } else {
            return ResponseError(args, { role, admin_role, thisRole: find.role }, "0.022.004")
        }
    } catch (error) {
        return ResponseError(args, error, "0.022.000")
    }
}

module.exports.removeAdmin = async (...args) => {
    try {
        const { id } = RequestParams(args)
        const { role: admin_role, admin, session } = RequestToken(args)

        const find = await connect.admin.findActive("0.019.001", { _id: id })
        if (find) {
            const role = find.role

            if (await permissionRemove(role, admin_role, session)) {
                await connect.admin.remove("0.019.003", id)
                await connect.history.create({
                    role: admin_role,
                    message: `${admin_role} ${role} ni ochirdi`,
                    id, admin, session
                })

                return Response(args, "Successful remove", 204)
            } else {
                return ResponseError(args, { role, admin_role }, "0.019.004")
            }
        } else {
            return ResponseError(args, { id, find }, "0.019.002")
        }
    } catch (error) {
        return ResponseError(args, error, "0.019.000")
    }
}

module.exports.activateAdmin = async (...args) => {
    try {
        const { id } = RequestParams(args)
        const { role: admin_role, admin, session } = RequestToken(args)

        const find = await connect.admin.findReactive("0.020.001", { _id: id })
        if (find) {
            const role = find.role

            if (await permissionActivate(role, admin_role, session)) {
                await connect.admin.activate("0.020.003", id)
                await connect.history.create({ role: admin_role, message: `${admin_role} ${role} ni activlashtirdi`, id, admin, session })

                return Response(args, "Successful activate", 200)
            } else {
                return ResponseError(args, { role, admin_role }, "0.020.004")
            }
        } else {
            return ResponseError(args, { id, find }, "0.020.002")
        }
    } catch (error) {
        return ResponseError(args, error, "0.020.000")
    }
}

module.exports.sessionDelete = async (...args) => {
    try {
        const { id } = RequestParams(args)
        const { role: admin_role, admin, session } = RequestToken(args)

        const find = await connect.admin.findOne("0.023.003", { _id: id })
        if (find) {
            const role = find.role

            if (await permissionSessionDelete(role, admin_role, session)) {
                await connect.session.delete(session)
                await connect.history.create({ role: admin_role, message: `${admin_role} ${role} ni sessionlar ochirmoqda`, id, admin, session })

                return Response(args, "Successful delete", 204)
            } else {
                return ResponseError(args, { role, admin_role }, "0.023.002")
            }
        } else {
            return ResponseError(args, { id, find }, "0.023.001")
        }
    } catch (error) {
        return ResponseError(args, error, "0.023.000")
    }
}

module.exports.superAdminDelete = async (...args) => {
    try {
        const { key } = RequestBody(args, informationValidate)

        if (!handshakeObj[key]) { return ResponseError(args, { handshakeObj, key }, "0.039.002") }
        delete handshakeObj[key]

        await connect.admin.superAdminDelete("0.039.001")
        return Response(args, "Successful delete", 204)
    } catch (error) {
        return ResponseError(args, error, "0.039.000")
    }
}

async function permissionCreate(role, admin_role, session_id) {
    const session = await connect.session.findById(session_id)
    const admin = permissionGlobal(admin_role, session.type == sessionType[0])

    if (admin) {
        if (admin.create.admin.includes(role)) { return true }
        return false
    } else {
        throw new CustomError({ admin_role, admin }, "1.000.000")
    }
}

async function permissionUpdate(role, findRole, admin_role, session_id) {
    const session = await connect.session.findById(session_id)
    const admin = permissionGlobal(admin_role, session.type == sessionType[0])

    if (admin) {
        if (admin.update.admin.includes(role) && admin.update.admin.includes(findRole)) {
            return true
        }
        return false
    } else {
        throw new CustomError({ admin_role, admin }, "1.000.000")
    }
}

async function permissionRemove(role, admin_role, session_id) {
    const session = await connect.session.findById(session_id)
    const admin = permissionGlobal(admin_role, session.type == sessionType[0])

    if (admin) {
        if (admin.remove.admin.includes(role)) { return true }
        return false
    } else {
        throw new CustomError({ admin_role, admin }, "1.000.000")
    }
}

async function permissionActivate(role, admin_role, session_id) {
    const session = await connect.session.findById(session_id)
    const admin = permissionGlobal(admin_role, session.type == sessionType[0])

    if (admin) {
        if (admin.activate.admin.includes(role)) { return true }
        return false
    } else {
        throw new CustomError({ admin_role, admin }, "1.000.000")
    }
}

async function permissionSessionDelete(role, admin_role, session_id) {
    const session = await connect.session.findById(session_id)
    const admin = permissionGlobal(admin_role, session.type == sessionType[0])

    if (admin) {
        if (admin.remove.admin.includes(role)) { return true }
        return false
    } else {
        throw new CustomError({ admin_role, admin }, "1.000.000")
    }
}