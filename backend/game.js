// Простая демонстрация: эхо-сервер + заглушка для игрового цикла.
// Здесь нужно будет расширить логику дурака: карточные колоды, игроки, правила.
export function handleSocket(ws) {
  // Состояние игры можно хранить в объекте, привязанном к каждому ws:
  ws.gameState = { deck: [], players: [], trump: null };

  // При подключении отсылаем приветствие
  ws.send(JSON.stringify({ type: "welcome", message: "Добро пожаловать в DurakOnTon!" }));

  ws.on("message", msg => {
    const data = JSON.parse(msg);
    // TODO: обрабатывать команды: join, deal, attack, defend и т.д.
    console.log("Received from client:", data);
    // Эхо-ответ:
    ws.send(JSON.stringify({ type: "echo", data }));
  });

  ws.on("close", () => console.log("WebSocket: клиент отключился"));
}
