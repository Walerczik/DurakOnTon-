import React from 'react';
import Card from './Card';
import EndTurnButton from './EndTurnButton';
import TrumpCard from './TrumpCard';

function GameBoard({ gameType, playersCount, setGameOver, setWinner }) {
  return (
    <div>
      <h1>Игра: {gameType === 'podkidnoy' ? 'Подкидной' : 'Переводной'}</h1>
      <p>Игроков: {playersCount}</p>

      <TrumpCard suit="Черви" value="6" />

      <div className="cards-container">
        <Card hidden />
        <Card hidden />
        <Card />
        <Card />
      </div>

      <div className="control-buttons">
        <EndTurnButton label="Отбой" />
        <EndTurnButton label="Беру" />
      </div>
    </div>
  );
}

export default GameBoard;
