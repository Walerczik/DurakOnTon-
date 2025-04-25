// backend/game.js
const waiting = [];

// Создаём колоду 36 карт
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

// Начинаем игру, когда есть два игрока
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
    attacker: 0,
    current: 0,
    players: [p1, p2]
  };

  [p1, p2].forEach((ws, idx) => {
    ws.game = game;
    ws.playerIdx = idx;
  });

  broadcastUpdate(game);
}

// Рассылаем всем игрокам актуальное состояние
function broadcastUpdate(game) {
  game.players.forEach((ws, i) => {
    const opp = 1 - i;
    ws.send(JSON.stringify({
      type: "update",
      hand: game.hands[i],
      opponentCount: game.hands[opp].length,
      deckCount: game.deck.length,
      trump: game.trump,
      tableAttack: game.table.attack,
      tableDefend: game.table.defend,
      attacker: game.attacker,
      current: game.current,
      playerIdx: i
    }));
  });
}

export function handleSocket(ws) {
  ws.on("message", raw => {
    const msg = JSON.parse(raw);

    // 1) Подключение
    if (msg.type === "join") {
      waiting.push(ws);
      if (waiting.length >= 2) {
        const [p1, p2] = waiting.splice(0, 2);
        startGame(p1, p2);
      } else {
        ws.send(JSON.stringify({ type: "waiting", message: "Ждём второго игрока…" }));
      }
      return;
    }

    // 2) Игровые ходы
    const game = ws.game;
    if (!game) return;
    const idx = ws.playerIdx;
    const opp = 1 - idx;

    // Атака
    if (msg.type === "attack" && game.current === game.attacker && idx === game.attacker) {
      const card = game.hands[idx].splice(msg.cardIndex, 1)[0];
      game.table.attack.push(card);
      game.current = opp;
      broadcastUpdate(game);
      return;
    }

    // Отбивка
    if (msg.type === "defend" && game.current === opp && idx === opp) {
      const card = game.hands[idx].splice(msg.cardIndex, 1)[0];
      game.table.defend.push(card);
      game.current = game.attacker;
      broadcastUpdate(game);
      return;
    }

    // Отбой (pass) – сбрасываем стол, меняем атакующего
    if (msg.type === "pass" && idx === game.attacker && game.current === game.attacker) {
      game.table.attack = [];
      game.table.defend = [];
      game.attacker = opp;
      game.current = game.attacker;
      broadcastUpdate(game);
      return;
    }

    // Беру – защитник забирает все карты
    if (msg.type === "take" && idx === opp && game.current === opp) {
      game.hands[idx].push(...game.table.attack, ...game.table.defend);
      game.table.attack = [];
      game.table.defend = [];
      game.attacker = idx;
      game.current = game.attacker;
      broadcastUpdate(game);
      return;
    }
  });

  ws.on("close", () => {
    // Можно убрать ws из очереди waiting, если он там есть
    const i = waiting.indexOf(ws);
    if (i !== -1) waiting.splice(i, 1);
  });
}