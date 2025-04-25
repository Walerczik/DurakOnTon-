// backend/game.js

// Создаем и тасуем колоду
function createDeck() {
  const suits = ["♠","♥","♦","♣"];
  const ranks = ["6","7","8","9","10","J","Q","K","A"];
  const deck = [];
  suits.forEach(suit =>
    ranks.forEach(rank => deck.push({ suit, rank }))
  );
  return deck;
}
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

const waiting = [];

export function handleSocket(ws) {
  ws.on("message", raw => {
    const msg = JSON.parse(raw);

    // Новый игрок зашел
    if (msg.type === "join") {
      waiting.push(ws);
      if (waiting.length >= 2) {
        const [p1, p2] = waiting.splice(0, 2);
        startGame(p1, p2);
      } else {
        ws.send(JSON.stringify({ type: "waiting", message: "Ждём второго игрока..." }));
      }
    }

    // Далее после старта игры
    if (!ws.game) return;
    const game = ws.game;
    const idx = ws.playerIdx;
    const defenderIdx = 1 - game.turnAttacker;

    // Атакующий ходит
    if (msg.type === "attack" && idx === game.turnAttacker) {
      const card = game.hands[idx].splice(msg.cardIndex, 1)[0];
      game.table.attack.push(card);
      game.turnDefender = defenderIdx;
      broadcastUpdate(game);
    }

    // Защищающемуся предлагается отбиться любым
    if (msg.type === "defend" && idx === defenderIdx && game.table.defend.length < game.table.attack.length) {
      const card = game.hands[idx].splice(msg.cardIndex, 1)[0];
      game.table.defend.push(card);
      broadcastUpdate(game);
    }

    // Атакующий может «отбить» (pass) — завершить раунд
    if (msg.type === "pass" && idx === game.turnAttacker) {
      // просто сброс стол
      game.table.attack = [];
      game.table.defend = [];
      game.turnAttacker = defenderIdx; // меняем роли
      broadcastUpdate(game);
    }

    // Защитный «беру» — добавляет все карты со стола в руку защитника
    if (msg.type === "take" && idx === defenderIdx) {
      game.hands[idx].push(...game.table.attack, ...game.table.defend);
      game.table.attack = [];
      game.table.defend = [];
      game.turnAttacker = defenderIdx; // пока защитник становится атакующим
      broadcastUpdate(game);
    }
  });

  ws.on("close", () => {
    // здесь можно чистить игру
  });
}

// Запуск игры при двух игроках
function startGame(p1, p2) {
  const deck = createDeck();
  shuffle(deck);
  const trump = deck.pop();
  const hands = [[], []];
  for (let i = 0; i < 6; i++) {
    hands[0].push(deck.pop());
    hands[1].push(deck.pop());
  }

  // Сохраняем состояние
  const game = {
    deck,
    trump,
    hands,
    table: { attack: [], defend: [] },
    turnAttacker: 0
  };

  [p1, p2].forEach((ws, idx) => {
    ws.game = game;
    ws.playerIdx = idx;
  });

  // Первичные рассылки
  broadcastUpdate(game);
}

// Рассылать всем актуальное состояние
function broadcastUpdate(game) {
  game.players = game.players || [];
  // Если игроки ещё не записаны – запишем
  if (!game.players.length) {
    game.players = [game.deck ? null : null]; // placeholder
  }
  // На самом деле у нас game.players уже проставлены в startGame

  game.players.forEach((ws, i) => {
    const opponentIdx = 1 - i;
    ws.send(JSON.stringify({
      type: "update",
      hand: game.hands[i],
      deckCount: game.deck.length,
      opponentCount: game.hands[opponentIdx].length,
      trump: game.trump,
      tableAttack: game.table.attack,
      tableDefend: game.table.defend,
      yourTurn: game.turnAttacker === i,
      role: game.turnAttacker === i ? "attacker" : "defender"
    }));
  });
}