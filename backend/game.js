// backend/game.js

// Создаём и тасуем колоду, раздаём, храним состояние
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

function startGame(p1, p2) {
  const deck = createDeck();
  shuffle(deck);
  const trump = deck.pop();
  const hands = [[],[]];
  for (let i = 0; i < 6; i++) {
    hands[0].push(deck.pop());
    hands[1].push(deck.pop());
  }
  const game = { deck, trump, hands, turn: 0 };
  [p1, p2].forEach((ws, idx) => {
    ws.game = game;
    ws.playerIdx = idx;
    ws.send(JSON.stringify({
      type: "gameStart",
      hand: game.hands[idx],
      trump,
      yourTurn: game.turn === idx,
      deckCount: game.deck.length   // ← новое поле
    }));
  });
}

export function handleSocket(ws) {
  ws.on("message", raw => {
    const msg = JSON.parse(raw);
    if (msg.type === "join") {
      waiting.push(ws);
      if (waiting.length >= 2) {
        const [p1,p2] = waiting.splice(0,2);
        startGame(p1,p2);
      } else {
        ws.send(JSON.stringify({ type:"waiting", message:"Ждём второго игрока..." }));
      }
    }
    else if (msg.type === "attack") {
      const game = ws.game, idx = ws.playerIdx;
      if (game && game.turn === idx) {
        const card = game.hands[idx].splice(msg.cardIndex,1)[0];
        [p1,p2 = null].forEach((_,i) => {
          const socket = i===0 ? game.players?.[0] : game.players?.[1];
          // просто эхо в MVP
          ws.send(JSON.stringify({ type:"cardPlayed", player: idx, card }));
        });
        game.turn = 1 - game.turn;
      }
    }
    // оставшиеся ветки defend/take...
  });
  ws.on("close", ()=>console.log("Клиент отключился"));
}