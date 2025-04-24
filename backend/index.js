const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { setupGame } = require('./game');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Настроим WebSocket game logic
setupGame(wss);

app.get('/', (req, res) => {
  res.send('Backend работает!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
