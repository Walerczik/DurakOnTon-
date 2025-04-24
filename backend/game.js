function handleGameSocket(ws) {
  ws.on('message', (message) => {
    console.log('Получено сообщение:', message);
    // TODO: логика игры
    ws.send(`Принято: ${message}`);
  });

  ws.send('Добро пожаловать в WebSocket DurakOnTon!');
}

module.exports = { handleGameSocket };
