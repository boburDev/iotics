const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { router } = require('./router');
const { connectDB } = require('./utils/connect_db');
const { startCopyLoop } = require('./config/loop/copy');
const { socket } = require('./web');
const { defaultData } = require('./config/default/default_data');
const { startMainLoop } = require('./connection');
const { connect } = require('./service');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 1000;
const DB = process.env.DB;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(router);

// setTimeout(async () => {
//     await connect.notification.create("", 1)
// }, 1);

connectDB(socket(app), PORT, DB).then(() => {
    defaultData()
    startCopyLoop()
    // startMainLoop()
}).catch(console.log);
