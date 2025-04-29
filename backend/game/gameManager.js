function initGame(gameType, playersCount) {
  return {
    gameType,
    playersCount,
    players: [],
    deck: generateDeck(),
    table: [],
    trump: null,
    currentTurn: null,
    status: 'waiting'
  };
}

function generateDeck() {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck = [];
  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push({ suit, rank, rankValue: getRankValue(rank) });
    });
  });
  return shuffle(deck);
}

function getRankValue(rank) {
  const order = { '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
  return order[rank];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function joinGame(game, playerId, username) {
  game.players.push({ id: playerId, username, hand: [] });
  // Раздать каждому игроку по 6 карт, если возможно
  game.players.forEach(player => {
    while (player.hand.length < 6 && game.deck.length > 0) {
      player.hand.push(game.deck.pop());
    }
  });
  // Если все игроки подключились, устанавливаем статус и текущий ход
  if (game.players.length === game.playersCount) {
    game.status = 'playing';
    game.currentTurn = game.players[0].id;
    // Определяем козырь — последняя карта колоды
    game.trump = game.deck[game.deck.length - 1]?.suit;
  }
}

function playCard(game, playerId, card) {
  // Базовая проверка: если игрок ходит, его карта удаляется из руки и добавляется в поле
  const player = game.players.find(p => p.id === playerId);
  if (!player) return;
  const index = player.hand.findIndex(c => c.suit === card.suit && c.rank === card.rank);
  if (index !== -1) {
    player.hand.splice(index, 1);
    game.table.push({ attack: card });
  }
}

function defendCard(game, playerId, attackCard, defenseCard) {
  // Проверка: карта защиты должна быть больше атакующей или быть козырной
  const player = game.players.find(p => p.id === playerId);
  if (!player) return;
  const index = player.hand.findIndex(c => c.suit === defenseCard.suit && c.rank === defenseCard.rank);
  if (index !== -1) {
    // Простая логика для проверки
    if (defenseCard.suit === attackCard.suit && defenseCard.rankValue > attackCard.rankValue ||
        defenseCard.suit === game.trump && attackCard.suit !== game.trump) {
      player.hand.splice(index, 1);
      const tableEntry = game.table.find(entry => !entry.defense && entry.attack.suit === attackCard.suit && entry.attack.rank === attackCard.rank);
      if (tableEntry) tableEntry.defense = defenseCard;
    }
  }
}

function endTurn(game, playerId) {
  // Если игрок, ход которого завершён, нажал "Отбой"
  // Сбрасываем карты со стола (отбой)
  game.table = [];
  // Добираем карты до 6
  game.players.forEach(player => {
    while (player.hand.length < 6 && game.deck.length > 0) {
      player.hand.push(game.deck.pop());
    }
  });
  // Меняем ход: следующий игрок становится текущим
  const currentIndex = game.players.findIndex(p => p.id === playerId);
  const nextIndex = (currentIndex + 1) % game.players.length;
  game.currentTurn = game.players[nextIndex].id;
}

function takeCards(game, playerId) {
  // Игрок, который не смог отбиться, забирает все карты со стола
  const player = game.players.find(p => p.id === playerId);
  if (!player) return;
  game.table.forEach(({ attack, defense }) => {
    player.hand.push(attack);
    if (defense) player.hand.push(defense);
  });
  game.table = [];
}

module.exports = {
  initGame,
  joinGame,
  playCard,
  defendCard,
  endTurn,
  takeCards
};
