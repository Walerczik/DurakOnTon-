import React from 'react';

function GameOverScreen({ winner }) {
  return (
    <div className="game-over">
      <h2>Игра окончена!</h2>
      <h3>Победитель: {winner}</h3>
    </div>
  );
}

export default GameOverScreen;
