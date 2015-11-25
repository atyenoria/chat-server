require('../.vscode/server.babel');
import {
    express
}
from 'express';
const app = express();
import {
    path
}
from 'path';
const http = require('http').Server(app);
import mongoose from 'mongoose'
import session from 'express-session'
import cors from 'cors'
import morgan from 'morgan'
import uuid from 'node-uuid'

function assignId(req, res, next) {
    req.id = uuid.v4();
    next();
}

morgan.token('id', req => {
    return req.id;
});
app.use(assignId);
app.use(morgan(' ":method :url HTTP/:http-version" :status :res[content-length]'));

import {
    testrouter
}
from './routes/test';
const passport = require('passport');
require('./passport/passport')(passport);
const MongoStore = require('connect-mongo')(session);
const User = require('./models/User');
process.env.MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/chat_dev';
process.env.PORT = 3000;
mongoose.connect(process.env.MONGOLAB_URI);
app.use(session({
    secret: 'secret',
    store: new MongoStore({
        url: 'mongodb://localhost/sample'
    }),
    cookie: {
        httpOnly: false,
        maxAge: new Date(Date.now() + 60 * 60 * 1000)
    },
    resave: false,
    saveUninitialized: true
}));
// app.use('/jwt', testrouter);
process.on('uncaughtException', err => {
    console.log(err);
});
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
//load routers
const messageRouter = express.Router();
const usersRouter = express.Router();
const channelRouter = express.Router();
require('./routes/user_routes')(usersRouter, passport);
require('./routes/channel_routes')(channelRouter);
require('./routes/message_routes')(messageRouter);
app.use('/api', messageRouter);
app.use('/api', usersRouter);
app.use('/api', channelRouter);
app.get('*', (req, res) => {
    // console.log(req)
    res.sendFile(path.join(__dirname, '../.vscode/index.html'));
});
const server = app.listen(process.env.PORT, 'localhost', err => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('**************************** App Server on port: %s ****************************', process.env.PORT);
});
const REDIS_HOST = 'localhost';
const REDIS_PORT = '6379';
const io = require('socket.io')(server);
const redis = require('redis').createClient;
const adapter = require('socket.io-redis');
const pub = redis(REDIS_PORT, REDIS_HOST);
const sub = redis(REDIS_PORT, REDIS_HOST);
io.adapter(adapter({
    pubClient: pub,
    subClient: sub
}));
const socketEvents = require('./socketEvents')(io);