// backend/game.js
const waiting = [];

// Колода 36 карт
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

// Может ли def побить atk по правилам
function canBeat(def, atk, trumpSuit) {
  if (def.suit === atk.suit) {
    const order = ["6","7","8","9","10","J","Q","K","A"];
    return order.indexOf(def.rank) > order.indexOf(atk.rank);
  }
  return def.suit === trumpSuit && atk.suit !== trumpSuit;
}

export function handleSocket(ws) {
  ws.on("message", raw => {
    const msg = JSON.parse(raw);

    // --- JOIN ---
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

    // Остальное только после старта
    const game = ws.game;
    if (!game) return;
    const idx = ws.playerIdx;
    const opp = 1 - idx;

    // --- ATTACK ---
    if (msg.type === "attack" && game.current === idx) {
      const card = game.hands[idx][msg.cardIndex];
      // Проверка: либо первый ход, либо ранг уже на столе
      const anyOnTable = [...game.table.attack, ...game.table.defend];
      const rankList = anyOnTable.map(c => c.rank);
      if (game.table.attack.length > 0 && !rankList.includes(card.rank)) {
        return; // недопустимый ход
      }
      game.hands[idx].splice(msg.cardIndex, 1);
      game.table.attack.push(card);
      game.current = opp;
      broadcast(game);
      return;
    }

    // --- DEFEND ---
    if (msg.type === "defend" && game.current === idx) {
      const atkCard = game.table.attack[game.table.defend.length];
      const defCard = game.hands[idx][msg.cardIndex];
      if (!canBeat(defCard, atkCard, game.trump.suit)) return;
      game.hands[idx].splice(msg.cardIndex, 1);
      game.table.defend.push(defCard);
      game.current = opp;
      broadcast(game);
      return;
    }

    // --- PASS (отбой) ---
    if (msg.type === "pass" && idx === game.attacker && game.current === idx) {
      game.table.attack = [];
      game.table.defend = [];
      game.attacker = opp;
      game.current = game.attacker;
      broadcast(game);
      return;
    }

    // --- TAKE (беру) ---
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
    const i = waiting.indexOf(ws);
    if (i !== -1) waiting.splice(i, 1);
  });
}

function startGame(p1, p2) {
  const deck = createDeck();
  shuffle(deck);
  const trump = deck.pop();
  const hands = [[],[]];
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
  [p1, p2].forEach((client, idx) => {
    client.game = game;
    client.playerIdx = idx;
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