var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var QUANDL_API_KEY = process.env.QUANDL_API_KEY;
var FORGE_API_KEY = process.env.FORGE_API_KEY;

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, 'views/dist')));

io.on('connection', (socket) => {
    console.log("User connected");

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('add-message', (message) => {
        io.emit('message', {type: 'new-message', text: message});
    });
});

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'views/dist/index.html'));
})

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", () => {
    var addr = server.address();
    console.log("Server listening at port", addr.address + ":" + addr.port);
});