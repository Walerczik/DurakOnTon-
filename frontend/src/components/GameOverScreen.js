import React from 'react';

function GameOverScreen({ winner }) {
  return (
    <div className="game-over">
      <h1>Игра окончена</h1>
      <h2>Победитель: {winner}</h2>
    </div>
  );
}

export default GameOverScreen;
