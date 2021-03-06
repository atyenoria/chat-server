var count = 0
var l = console.log

var jwt = require('jsonwebtoken');

exports = module.exports = function(io) {
    io.on('connection', function(socket) {


        socket.on('disconnect', function() {
            console.info('SOCKET [%s] DISCONNECTED', socket.id);
        });

        console.info('SOCKET [%s] CONNECTED', socket.id);
        socket.emit('authenticated');



        socket.emit('test', {
            test: "server ok"
        })

        socket.on('test', function(msg) {
            console.log(msg)
        });


        socket.emit('socketid', socket.id)
        console.log(socket.id)
        socket.on('restart', function(channel) {
            console.log("client restartd")
            console.log(socket.adapter.rooms.room2)
            console.log("client restartd")
        });

        socket.on('get room people', function(channel) {
            console.log("client restartd")
            console.log(socket.adapter.rooms.room2)
            console.log("client restartd")
            socket.emit('replay get room people', socket.adapter.rooms.room2)
        });

        socket.on('new message', function(msg) {
            socket.to('room2').emit('new bc message', msg);
            console.log(socket.id)
                // console.log(this.socket.sessionid);
                // socket.broadcast.emit('new bc message', msg);
            console.log('new message')
        });
        socket.on('new channel', function(channel) {
            socket.broadcast.emit('new channel', channel)
        });
        socket.on('typing', function() {
            console.log("typing")
            socket.broadcast.emit('typing bc', socket.username);
        });
        socket.on('stop typing', function() {
            socket.broadcast.emit('stop typing bc', socket.username);
        });

        socket.on('id msg', function(msg) {
            console.log(socket.id)
            console.log("on:id msg")
            console.log(msg[0].id)
                // socket.to('room2').emit('gg',{test: "msg1 ok"})
            socket.to(msg[0].id).emit('gg', {
                test: "msg2 ok"
            })
        });


    })
};