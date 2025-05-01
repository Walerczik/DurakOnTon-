import React, { useState } from 'react';
import './Lobby.css';

function Lobby() {
  const [numPlayers, setNumPlayers] = useState(2);
  const [gameType, setGameType] = useState('подкидной');

  const handleCreateRoom = () => {
    console.log('Создание комнаты:', numPlayers, gameType);
    // Тут будет логика
  };

  return (
    <div className="lobby-container">
      <div className="lobby-content">
        <img src="/logo.png" alt="Logo" className="lobby-logo" />
        <h2>Создать комнату</h2>

        <div className="lobby-select">
          <label>Количество игроков:</label>
          <select value={numPlayers} onChange={(e) => setNumPlayers(parseInt(e.target.value))}>
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={6}>6</option>
          </select>
        </div>

        <div className="lobby-select">
          <label>Тип игры:</label>
          <select value={gameType} onChange={(e) => setGameType(e.target.value)}>
            <option value="подкидной">Подкидной</option>
            <option value="переводной">Переводной</option>
          </select>
        </div>

        <button className="create-button" onClick={handleCreateRoom}>
          Создать комнату
        </button>
      </div>
    </div>
  );
}

export default Lobby;