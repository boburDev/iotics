const { sessionType, adminRolesList } = require('../global/enum');
const { connect } = require('../service');
const { ResponseError, ResponseCookie } = require('../config/welcomers/response')
const { verify, sign } = require('../utils/jwt');
const { RequestBody } = require('../config/welcomers/request');
const { refreshValidate } = require('../validation/auth/auth');
const { permissionGlobal } = require('../global/permission');

module.exports.checkToken = (...roles) => {
    return async (req, res, next) => {
        const args = [req, res, next]
        try {
            if (!roles.length) { roles = adminRolesList }

            const access_token = req.headers?.access_token;
            if (!access_token) return ResponseError(args, { headers: req.headers }, "0.008.001");
            const { token, id, module } = await verify(access_token)

            const session = await connect.session.findById(id)
            if (!session) { return ResponseError(args, { session }, "0.008.016"); }
            if (new Date() - new Date(session.last_active) >= (180 * 24 * 60 * 60 * 1000)) {
                return ResponseError(args, { last_active: session.last_active, now: new Date() }, "0.008.002");
            }

            const data = await verify(token, session[module + '_access'].access_key)
            if (new Date() - new Date(data.exp) >= 60000 || new Date() - new Date(session[module + '_access'].access) >= 60000) {
                return ResponseError(args, { exp: new Date(data.exp), now: new Date(), access: new Date(session[module + '_access'].access) }, "0.008.003");
            }

            if (!roles.includes(data.role)) {
                return ResponseError(args, { userRole: data.role, permisions: roles }, "0.008.004");
            }

            const admin = await connect.admin.findOne("0.008.017", { _id: data.id })
            if (!admin) { return ResponseError(args, { admin, _id: data.id }, "0.008.012"); }
            if (!admin.active) { return ResponseError(args, { admin, _id: data.id }, "0.008.013"); }

            req.admin = data.id
            req.session = data.session
            req.role = data.role
            const newToken = sign(data, id, module)
            ResponseCookie(args, newToken.token)

            if (session.createdAt - new Date() >= 10 * 24 * 60 * 60 * 1000) {
                await connect.session.update(session._id, { type: sessionType[0] })
            }

            await connect.session.update(id, { [module + '_access']: { access_key: newToken.secret }, last_active: new Date() })
            next()
        } catch (error) {
            return ResponseError(args, error, "0.008.000")
        }
    }
}

module.exports.checkTokenRout = (method, group, rout) => {
    return async (req, res, next) => {
        const args = [req, res, next]
        try {
            const access_token = req.headers?.access_token;
            if (!access_token) return ResponseError(args, { headers: req.headers }, "0.032.001");
            const { token, id, module } = await verify(access_token)

            const session = await connect.session.findById(id)
            if (!session) { return ResponseError(args, { session }, "0.032.007"); }
            if (new Date() - new Date(session.last_active) >= (180 * 24 * 60 * 60 * 1000)) {
                return ResponseError(args, { last_active: session.last_active, now: new Date() }, "0.032.002");
            }

            const data = await verify(token, session[module + '_access'].access_key)
            if (new Date() - new Date(data.exp) >= 60000 || new Date() - new Date(session[module + '_access'].access) >= 60000) {
                return ResponseError(args, { exp: new Date(data.exp), now: new Date(), access: new Date(session[module + '_access'].access) }, "0.032.003");
            }

            const json = permissionGlobal(data.role, session.type == sessionType[0])
            if (!json?.[method]?.[group]?.includes(rout)) {
                return ResponseError(args, { userRole: data.role, method, group, rout, type: session.type }, "0.032.004");
            }

            const admin = await connect.admin.findOne("0.032.008", { _id: data.id })
            if (!admin) { return ResponseError(args, { admin, _id: data.id }, "0.032.005"); }
            if (!admin.active) { return ResponseError(args, { admin, _id: data.id }, "0.032.006"); }

            req.admin = data.id
            req.session = data.session
            req.role = data.role
            const newToken = sign(data, id, module)
            ResponseCookie(args, newToken.token)

            if (session.createdAt - new Date() >= 10 * 24 * 60 * 60 * 1000) {
                await connect.session.update(session._id, { type: sessionType[0] })
            }

            await connect.session.update(id, { [module + '_access']: { access_key: newToken.secret }, last_active: new Date() })
            next()
        } catch (error) {
            return ResponseError(args, error, "0.032.000")
        }
    }
}

module.exports.refreshToken = async (req, res) => {
    const args = [req, res]
    try {
        console.log('zapros keldi')
        const { application_name: module } = RequestBody(args, refreshValidate)
        const refresh_token = req.headers?.refresh_token;
        if (!refresh_token) return ResponseError(args, { headers: req.headers }, "0.008.005");

        const { token, id } = await verify(refresh_token)
        const session = await connect.session.findById(id)
        console.log(session)
        if (!session) {
            console.log('ichkariga kridi')
            return ResponseError(args, { id: id }, "0.008.006")
        }

        console.log(session.refresh_key, "session.refresh_key")
        const data = await verify(token, session.refresh_key)
        console.log(data, 'data')
        const month = 30 * 24 * 60 * 60 * 1000;
        if (new Date() - new Date(data.exp) >= month) {
            await connect.session.delete(id)
            return ResponseError(args, { month: new Date(data.exp), date: new Date() }, "0.008.006")
        }

        const admin = await connect.admin.findOne("0.008.018", { _id: data.id })
        if (!admin) { return ResponseError(args, { admin, _id: data.id }, "0.008.014"); }
        if (!admin.active) { return ResponseError(args, { admin, _id: data.id }, "0.008.015"); }

        const newAccessToken = sign(data, id, module)
        await connect.session.update(id, {
            [module + '_access']: {
                access_key: newAccessToken.secret,
                access: new Date()
            }
        })

        console.log('Ketdi')
        ResponseCookie(args, newAccessToken.token)
        return res.status(200).json({ status: 200, error: null, data: { access_token: newAccessToken.token } })
    } catch (error) {
        console.log(error)
        return ResponseError(args, error, "0.008.007")
    }
}
