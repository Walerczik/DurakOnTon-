const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const gameRoutes = require('./routes/gameRoutes');
const { initGame, joinGame, playCard, defendCard, endTurn, takeCards } = require('./game/gameManager');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/game', gameRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// В этом примере для каждой комнаты создаётся своя игра
const games = {};

// Обработка сокет-соединений
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('createGame', ({ gameType, playersCount }) => {
    const roomId = Date.now().toString();
    games[roomId] = initGame(gameType, playersCount);
    socket.join(roomId);
    socket.emit('gameCreated', { roomId, state: games[roomId] });
    console.log(`Game created: ${roomId}`);
  });

  socket.on('joinGame', ({ roomId, username }) => {
    if (games[roomId]) {
      joinGame(games[roomId], socket.id, username);
      socket.join(roomId);
      io.to(roomId).emit('gameUpdate', games[roomId]);
    }
  });

  socket.on('playCard', ({ roomId, card }) => {
    playCard(games[roomId], socket.id, card);
    io.to(roomId).emit('gameUpdate', games[roomId]);
  });

  socket.on('defendCard', ({ roomId, attackCard, defenseCard }) => {
    defendCard(games[roomId], socket.id, attackCard, defenseCard);
    io.to(roomId).emit('gameUpdate', games[roomId]);
  });

  socket.on('endTurn', ({ roomId }) => {
    endTurn(games[roomId], socket.id);
    io.to(roomId).emit('gameUpdate', games[roomId]);
  });

  socket.on('takeCards', ({ roomId }) => {
    takeCards(games[roomId], socket.id);
    io.to(roomId).emit('gameUpdate', games[roomId]);
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    // Добавить обработку удаления игрока из игры, если нужно
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
