// backend/game.js
const waiting = [];

// Создаём колоду 36 карт
function createDeck() {
  const suits = ["♠","♥","♦","♣"];
  const ranks = ["6","7","8","9","10","J","Q","K","A"];
  const deck = [];
  suits.forEach(s => ranks.forEach(r => deck.push({ suit: s, rank: r })));
  return deck;
}

// Перемешиваем
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Может ли def побить atk
function canBeat(def, atk, trumpSuit) {
  if (def.suit === atk.suit) {
    const order = ["6","7","8","9","10","J","Q","K","A"];
    return order.indexOf(def.rank) > order.indexOf(atk.rank);
  }
  return def.suit === trumpSuit && atk.suit !== trumpSuit;
}

// Запуск WebSocket-игры
export function handleSocket(ws) {
  ws.on("message", raw => {
    const msg = JSON.parse(raw);

    // 1) JOIN
    if (msg.type === "join") {
      waiting.push(ws);
      if (waiting.length === 2) {
        const [p1, p2] = waiting.splice(0, 2);
        startGame(p1, p2);
      } else {
        ws.send(JSON.stringify({ type: "waiting", message: "Ждём второго игрока…" }));
      }
      return;
    }

    // остальное — после старта
    const game = ws.game;
    if (!game) return;
    const idx = ws.playerIdx;
    const opp = 1 - idx;

    // ATTACK
    if (msg.type === "attack" && game.current === idx) {
      const card = game.hands[idx][msg.cardIndex];
      // проверка: первый ход или ранг уже на столе
      const onTable = [...game.table.attack, ...game.table.defend].map(c => c.rank);
      if (game.table.attack.length > 0 && !onTable.includes(card.rank)) {
        return;
      }
      game.hands[idx].splice(msg.cardIndex, 1);
      game.table.attack.push(card);
      game.current = opp;
      broadcast(game);
      return;
    }

    // DEFEND
    if (msg.type === "defend" && game.current === idx) {
      const atkCard = game.table.attack[game.table.defend.length];
      const defCard = game.hands[idx][msg.cardIndex];
      if (!canBeat(defCard, atkCard, game.trump.suit)) return;
      game.hands[idx].splice(msg.cardIndex, 1);
      game.table.defend.push(defCard);
      // если всё отбито — раунд окончен
      if (game.table.defend.length === game.table.attack.length) {
        endRound(game, idx); // defender становится следующим атакующим
      } else {
        game.current = opp;
        broadcast(game);
      }
      return;
    }

    // PASS (отбой) — атакующий сбрасывает стол
    if (msg.type === "pass" && idx === game.attacker && game.current === idx) {
      endRound(game, opp); // атакующий сбросил — очередь за оппонентом
      return;
    }

    // TAKE (беру) — защитник забирает все
    if (msg.type === "take" && idx !== game.attacker && game.current === idx) {
      // defender забирает
      game.hands[idx].push(...game.table.attack, ...game.table.defend);
      game.table.attack = [];
      game.table.defend = [];
      // очередь остаётся за атакующим
      endRound(game, game.attacker);
      return;
    }
  });

  ws.on("close", () => {
    const i = waiting.indexOf(ws);
    if (i !== -1) waiting.splice(i, 1);
  });
}

// Запуск партии
function startGame(p1, p2) {
  const deck = createDeck();
  shuffle(deck);
  // дать по 6 карт, берём из начала для сохранения trump внизу
  const hands = [[], []];
  for (let i = 0; i < 6; i++) {
    hands[0].push(deck.shift());
    hands[1].push(deck.shift());
  }
  const trump = deck[deck.length - 1]; // остаётся внизу
  const game = {
    deck, trump, hands,
    table: { attack: [], defend: [] },
    attacker: 0,
    current: 0,
    players: [p1, p2]
  };
  [p1, p2].forEach((ws, i) => {
    ws.game = game;
    ws.playerIdx = i;
  });
  broadcast(game);
}

// Окончание раунда и добор карт
function endRound(game, nextAttacker) {
  // отброшенные карты просто улетают в discard (не храним)
  game.table.attack = [];
  game.table.defend = [];
  // добираем сначала новый атакующий, потом второй
  [nextAttacker, 1 - nextAttacker].forEach(i => {
    while (game.hands[i].length < 6 && game.deck.length > 0) {
      game.hands[i].push(game.deck.shift());
    }
  });
  game.attacker = nextAttacker;
  game.current = nextAttacker;
  broadcast(game);
}

// Рассылка состояния
function broadcast(game) {
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