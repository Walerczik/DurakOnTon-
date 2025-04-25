const waiting = [];

// Создаем колоду 36 карт
function createDeck() {
  const suits = ["♠","♥","♦","♣"];
  const ranks = ["6","7","8","9","10","J","Q","K","A"];
  const deck = [];
  suits.forEach(suit =>
    ranks.forEach(rank => deck.push({ suit, rank }))
  );
  return deck;
}

// Перемешиваем колоду
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

export function handleSocket(ws) {
  ws.on("message", raw => {
    const msg = JSON.parse(raw);

    // 1) Подключение к игре
    if (msg.type === "join") {
      waiting.push(ws);
      if (waiting.length >= 2) {
        const [p1, p2] = waiting.splice(0, 2);
        startGame(p1, p2);
      } else {
        ws.send(JSON.stringify({ type: "waiting", message: "Ждём второго игрока..." }));
      }
      return;
    }

    // 2) Все остальные сообщения только после старта
    if (!ws.game) return;
    const game = ws.game;
    const idx = ws.playerIdx;
    const opponentIdx = 1 - idx;

    // Атакующий ходит
    if (msg.type === "attack" && idx === game.turnAttacker) {
      const card = game.hands[idx].splice(msg.cardIndex, 1)[0];
      game.table.attack.push(card);
      game.turnDefender = opponentIdx;
      broadcastUpdate(game);
      return;
    }

    // Защитник отбивается
    if (
      msg.type === "defend" &&
      idx !== game.turnAttacker &&
      game.table.defend.length < game.table.attack.length
    ) {
      const card = game.hands[idx].splice(msg.cardIndex, 1)[0];
      game.table.defend.push(card);
      broadcastUpdate(game);
      return;
    }

    // Атакующий сбрасывает карты (pass)
    if (msg.type === "pass" && idx === game.turnAttacker) {
      game.table.attack = [];
      game.table.defend = [];
      game.turnAttacker = opponentIdx;
      broadcastUpdate(game);
      return;
    }

    // Защитник берёт карты
    if (msg.type === "take" && idx !== game.turnAttacker) {
      game.hands[idx].push(...game.table.attack, ...game.table.defend);
      game.table.attack = [];
      game.table.defend = [];
      game.turnAttacker = idx;
      broadcastUpdate(game);
      return;
    }
  });

  ws.on("close", () => console.log("WebSocket: client disconnected"));
}

function startGame(p1, p2) {
  const deck = createDeck();
  shuffle(deck);
  const trump = deck.pop();
  const hands = [[], []];
  for (let i = 0; i < 6; i++) {
    hands[0].push(deck.pop());
    hands[1].push(deck.pop());
  }
  const game = {
    deck,
    trump,
    hands,
    table: { attack: [], defend: [] },
    turnAttacker: 0,
    players: [p1, p2]
  };

  // Привязываем состояние к ws
  [p1, p2].forEach((ws, idx) => {
    ws.game = game;
    ws.playerIdx = idx;
  });

  broadcastUpdate(game);
}

function broadcastUpdate(game) {
  game.players.forEach((ws, i) => {
    const opponentIdx = 1 - i;
    ws.send(JSON.stringify({
      type: "update",
      hand: game.hands[i],
      opponentCount: game.hands[opponentIdx].length,
      deckCount: game.deck.length,
      trump: game.trump,
      tableAttack: game.table.attack,
      tableDefend: game.table.defend,
      yourTurn: game.turnAttacker === i,
      role: game.turnAttacker === i ? "attacker" : "defender"
    }));
  });
}