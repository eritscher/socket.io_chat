const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;
server.listen(port, () => {
    console.log('listening on ', port);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html');
});
app.get('/swift', (req, res) => {
    res.sendFile(__dirname + '/public/swift.html');
});
app.get('/css', (req, res) => {
    res.sendFile(__dirname + '/public/css.html');
});

const tech = io.of('/tech');

tech.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        tech.in(data.room).emit('message', `New user joined ${data.room}`);
    });
    socket.on('message', (data) => {
        tech.in(data.room).emit('message', data.message);
    });

    socket.on('disconnect', () => {
        console.log('[SOCKET] user disconnected');
        tech.emit('message', 'user disconnected');
    });
});
