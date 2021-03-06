var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 5000;
server.listen(port);

app.use("/", express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
    socket.on('msg', function (data) {
	io.sockets.emit('newState', data);
    });
    socket.on('vid', function (id) {
	io.sockets.emit('newVideo', id);
    });
});