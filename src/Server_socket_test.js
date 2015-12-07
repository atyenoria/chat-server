//  enable runtime transpilation to use ES6/7 in node
var fs = require('fs');
var babelrc = fs.readFileSync('./.babelrc');
try {
    config = JSON.parse(babelrc);
} catch (err) {
    console.error('==>     ERROR: Error parsing your .babelrc.');
    console.error(err);
}
require('babel-core/register')(config);


import express from 'express';
const app = express();
import path from 'path';
var http = require('http').Server(app);
const PORT = 3000


const server = app.listen(PORT, 'localhost', err => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('************ Socket.io Server on port: %s ************', PORT);
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
const socketEvents = require('./../../websocket-bench/socket')(io);