import React, { useState } from 'react';
import logo from 'Logo.png';

function Lobby({ setGameStarted, setGameType, setPlayersCount }) {
  const [type, setType] = useState('podkidnoy');
  const [count, setCount] = useState(2);

  const startGame = () => {
    setGameType(type);
    setPlayersCount(count);
    setGameStarted(true);
  };

  return (
    <div className="lobby-container">
      <img src="/Logo.png" />
      <h2>Выберите тип игры</h2>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="podkidnoy">Подкидной</option>
        <option value="perevodnoy">Переводной</option>
      </select>
      <h2>Количество игроков</h2>
      <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
        <option value="2">2</option>
        <option value="6">6</option>
      </select>
      <button onClick={startGame}>Начать игру</button>
    </div>
  );
}

export default Lobby;
