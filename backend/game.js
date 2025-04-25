// Создаем колоду 36 карт
function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = ["6","7","8","9","10","J","Q","K","A"];
  const deck = [];
  suits.forEach(suit =>
    ranks.forEach(rank => deck.push({ suit, rank }))
  );
  return deck;
}

// Перемешиваем
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Ждущие игроки
const waiting = [];

// Запускаем игру, когда двое подключились
function startGame(p1, p2) {
  const deck = createDeck();
  shuffle(deck);
  const trump = deck.pop();
  const hands = [[], []];
  // Раздаем по 6 карт
  for (let i = 0; i < 6; i++) {
    hands[0].push(deck.pop());
    hands[1].push(deck.pop());
  }
  const game = { deck, trump, hands, turn: 0 /* 0 = p1 ходит */ };

  // У каждого ws сохраняем состояние
  [p1, p2].forEach((ws, idx) => {
    ws.game = game;
    ws.playerIdx = idx;
    ws.send(
      JSON.stringify({
        type: "gameStart",
        hand: game.hands[idx],
        trump,
        yourTurn: game.turn === idx
      })
    );
  });
}

export function handleSocket(ws) {
  ws.on("message", raw => {
    const msg = JSON.parse(raw);
    if (msg.type === "join") {
      waiting.push(ws);
      if (waiting.length >= 2) {
        const [p1, p2] = waiting.splice(0, 2);
        startGame(p1, p2);
      } else {
        ws.send(JSON.stringify({ type: "waiting", message: "Ждем второго игрока..." }));
      }
    }
    else if (msg.type === "attack") {
      const game = ws.game;
      const idx = ws.playerIdx;
      if (game && game.turn === idx) {
        const card = game.hands[idx].splice(msg.cardIndex, 1)[0];
        // Передаем ход обоим
        [game.hands[0], game.hands[1]].forEach((_, i) => {
          const socket = i === 0 ? waiting[0] : waiting[1];
          socket.send(
            JSON.stringify({ type: "cardPlayed", player: idx, card })
          );
        });
        // Передаем ход сопернику
        game.turn = 1 - game.turn;
      }
    }
  });

  ws.on("close", () => console.log("Клиент отключился"));
}