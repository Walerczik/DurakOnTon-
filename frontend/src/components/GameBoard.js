import React from 'react';
import PlayerHand from './PlayerHand';
import './GameBoard.css';

const GameBoard = ({ socket, playerHand, roomId }) => {
  const playCard = (card) => {
    socket.emit('playCard', { roomId, card });
  };

  return (
    <div className="game-board">
      <div className="deck-area">
        <div className="deck-count">Карт в колоде: 18</div>
        <div className="deck-back"></div>
      </div>
      <div className="play-area">
        <h2>Игровое поле</h2>
        {/* Здесь можно будет добавить брошенные карты */}
      </div>
      <PlayerHand cards={playerHand} playCard={playCard} />
    </div>
  );
};

export default GameBoard;
