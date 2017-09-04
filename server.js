var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

var listOfStockData = [];

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, 'views/dist')));

io.on('connection', (socket) => {
    // console.log("User connected");

    socket.on('disconnect', () => {
        // console.log('User disconnected');
    });

    socket.on('add-stock', (data) => {
        listOfStockData.push(data);
        io.emit('stockAdded', {stockData: data});
    });

    socket.on('remove-stock', (index) => {
        listOfStockData.splice(index, 1);
        io.emit('stockRemoved', {stockIndex: index});
    });
});

app.get('/getStocks', (req, res) => {
    res.send(listOfStockData);
})

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'views/dist/index.html'));
})

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", () => {
    var addr = server.address();
    console.log("Server listening at port", addr.address + ":" + addr.port);
});