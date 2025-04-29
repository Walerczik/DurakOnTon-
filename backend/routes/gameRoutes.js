const express = require('express');
const router = express.Router();
const { initGame, joinGame } = require('../game/gameManager');

router.post('/create', (req, res) => {
  const { gameType, playersCount } = req.body;
  const game = initGame(gameType, playersCount);
  res.json({ roomId: game.roomId, state: game });
});

router.post('/join', (req, res) => {
  const { roomId, username, playerId } = req.body;
  joinGame(games[roomId], playerId, username);
  res.json({ success: true });
});

module.exports = router;
