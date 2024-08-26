const http = require('http');
const socketIo = require('socket.io');
const { adminRolesList } = require('../global/enum');

let io
const sockets = {}
const superAdmin = {}
const admin = {}
const user = {}
const viewer = {}
module.exports.socket = (app) => {
    const server = http.createServer(app)
    io = socketIo(server);
    return server
};

const timeout = setTimeout(() => {
    clearTimeout(timeout)
    io.on('connection', (socket) => {
        console.log('New connection: ', socket.id)

        socket.on('message', (msg) => {
            const { id } = msg
            if (sockets[id] && sockets[id].step == 1) {
                const { role, session } = sockets[id]
                checking(role, session, socket, id)
            } else {
                sockets[id] = { socket, step: 0 }
            }
        });

        socket.on('disconnect', () => {
            const id = socket.id

            if (superAdmin[id]) {
                delete superAdmin[id]
            } else if (admin[id]) {
                delete admin[id]
            } else if (user[id]) {
                delete admin[id]
            } else if (viewer) {
                delete viewer[id]
            }
        })
    });
}, 1000);

module.exports.distributorSocket = (message, role, notification) => {
    if (role == adminRolesList[0]) {
        for (const key in superAdmin) {
            const { socket, id } = superAdmin[key]

            console.log(id)
            socket.emit('notification', { type: notification.type, message })
        };
    } else if (role == adminRolesList[1]) {
        for (const key in admin) {
            const { socket, id } = admin[key]

            console.log(id)
            socket.emit('notification', { type, message })
        };
    } else if (role == adminRolesList[2]) {
        for (const key in user) {
            const { socket, id } = user[key]

            console.log(id)
            socket.emit('notification', { type, message })
        };
    } else if (role == adminRolesList[3]) {
        for (const key in viewer) {
            const { socket, id } = viewer[key]

            console.log(id)
            socket.emit('notification', { type, message })
        };
    }
};

module.exports.socketController = (req, res) => {
    const { admin, session, role, access_token } = req

    if (sockets[admin] && sockets[admin].step == 0) {
        const { socket } = sockets[admin]
        checking(role, session, socket, admin)
    } else {
        sockets[admin] = { role, session, step: 1 }
    }

    res.status(200).json({ status: 200, message: "OK", cache: access_token })
}

function checking(role, session, socket, admin) {
    const id = socket.id
    if (role == adminRolesList[0]) {
        superAdmin[id] = { role, session, socket, id }
    } else if (role == adminRolesList[1]) {
        admin[id] = { role, session, socket, id }
    } else if (role == adminRolesList[2]) {
        user[id] = { role, session, socket, id }
    } else if (role == adminRolesList[3]) {
        viewer[id] = { role, session, socket, id }
    }

    delete sockets[admin]
}
