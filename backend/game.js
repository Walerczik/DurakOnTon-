// backend/game.js
const waiting = [];

// Создаем и тасуем колоду
function createDeck() {
  const suits = ["♠","♥","♦","♣"];
  const ranks = ["6","7","8","9","10","J","Q","K","A"];
  const deck = [];
  suits.forEach(s => ranks.forEach(r => deck.push({ suit: s, rank: r })));
  return deck;
}
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Проверяет, может ли defend побить attack
function canBeat(def, atk, trumpSuit) {
  if (def.suit === atk.suit) {
    const order = [..."6789JQKA"];
    return order.indexOf(def.rank) > order.indexOf(atk.rank);
  }
  return def.suit === trumpSuit && atk.suit !== trumpSuit;
}

export function handleSocket(ws) {
  ws.on("message", raw => {
    const msg = JSON.parse(raw);

    // JOIN
    if (msg.type === "join") {
      waiting.push(ws);
      if (waiting.length === 2) {
        const [p1, p2] = waiting.splice(0, 2);
        startGame(p1, p2);
      } else {
        ws.send(JSON.stringify({ type: "waiting", message: "Ждём второго..." }));
      }
      return;
    }

    // Игровые действия
    const game = ws.game;
    if (!game) return;
    const idx = ws.playerIdx;
    const opp = 1 - idx;

    // Атаковать
    if (msg.type === "attack" && game.current === idx) {
      const card = game.hands[idx].splice(msg.cardIndex, 1)[0];
      game.table.attack.push(card);
      game.current = opp;
      broadcast(game);
      return;
    }
    // Отбиться
    if (msg.type === "defend" && game.current === idx) {
      const atkCard = game.table.attack[game.table.defend.length];
      const defCard = game.hands[idx][msg.cardIndex];
      if (!canBeat(defCard, atkCard, game.trump.suit)) return;
      const card = game.hands[idx].splice(msg.cardIndex, 1)[0];
      game.table.defend.push(card);
      game.current = opp;
      broadcast(game);
      return;
    }
    // Отбой (pass)
    if (msg.type === "pass" && idx === game.attacker && game.current === idx) {
      game.table.attack = [];
      game.table.defend = [];
      game.attacker = opp;
      game.current = game.attacker;
      broadcast(game);
      return;
    }
    // Брать
    if (msg.type === "take" && idx !== game.attacker && game.current === idx) {
      game.hands[idx].push(...game.table.attack, ...game.table.defend);
      game.table.attack = [];
      game.table.defend = [];
      game.current = game.attacker;
      broadcast(game);
      return;
    }
  });

  ws.on("close", () => {
    // Если игрок ушёл до старта
    const i = waiting.indexOf(ws);
    if (i >= 0) waiting.splice(i, 1);
  });
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
    deck, trump, hands,
    table: { attack: [], defend: [] },
    attacker: 0,
    current: 0,
    players: [p1, p2]
  };
  [p1, p2].forEach((ws, idx) => {
    ws.game = game;
    ws.playerIdx = idx;
  });
  broadcast(game);
}

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