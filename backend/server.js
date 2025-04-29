const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

let rooms = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('createRoom', () => {
    const roomId = Math.random().toString(36).substr(2, 6);
    rooms[roomId] = [socket.id];
    socket.join(roomId);
    socket.emit('roomCreated', { roomId });
    console.log(`Room created: ${roomId}`);
  });

  socket.on('joinRoom', ({ roomId }) => {
    const room = rooms[roomId];
    if (room && room.length === 1) {
      room.push(socket.id);
      socket.join(roomId);
      io.to(roomId).emit('startGame', { roomId });
      console.log(`Player joined room: ${roomId}`);
    } else {
      socket.emit('error', { message: 'Room not found or full.' });
    }
  });

  socket.on('playCard', ({ roomId, card }) => {
    socket.to(roomId).emit('opponentPlayedCard', { card });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

server.listen(5000, () => {
  console.log('Server listening on port 5000');
});
