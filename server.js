// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let rooms = [];
let users = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('createRoom', (roomName) => {
    if (!rooms.includes(roomName)) {
      rooms.push(roomName);
      io.emit('roomList', rooms);
    }
  });

  socket.on('joinRoom', (roomName, username) => {
    socket.join(roomName);
    users[socket.id] = { room: roomName, username };
    socket.to(roomName).emit('message', { username: 'System', message: `${username} joined the room` });
  });

  socket.on('sendMessage', (data) => {
    const { room, username } = users[socket.id];
    io.to(room).emit('message', { username, message: data.message, timestamp: new Date().toLocaleTimeString() });
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      const { room, username } = user;
      socket.to(room).emit('message', { username: 'System', message: `${username} left the room` });
      delete users[socket.id];
    }
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
