const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

io.on('connection', (socket) => {

    console.log('Client connected');

    var onevent = socket.onevent;
    socket.onevent = function (packet) {
        var args = packet.data || [];
        onevent.call (this, packet);    // original call
        packet.data = ["*"].concat(args);
        onevent.call(this, packet);      // additional call to catch-all
    };

    socket.on("*",function(event,data) {

    });

    socket.on('deleted', (msg) => {
        io.emit('deleted', msg);
    });

    socket.on('added', (msg) => {
        console.log(msg);
        io.emit('added', msg);
    });

    socket.on('edited', (msg) => {
        io.emit('deleted', msg);
    });

});
