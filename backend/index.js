const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { handleGameSocket } = require('./game');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', handleGameSocket);

server.listen(3001, () => {
  console.log('Backend сервер запущен на http://localhost:3001');
});
