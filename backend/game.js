function setupGame(wss) {
  wss.on('connection', (ws) => {
    console.log('Новое подключение');
    ws.send(JSON.stringify({ type: 'welcome', message: 'Привет!' }));

    ws.on('message', (message) => {
      console.log('Получено сообщение:', message);
      // Здесь будет логика игры
    });

    ws.on('close', () => {
      console.log('Подключение закрыто');
    });
  });
}

module.exports = { setupGame };
