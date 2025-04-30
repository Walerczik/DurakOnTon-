import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Lobby.css';

function Lobby() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState(2);
  const [gameType, setGameType] = useState('подкидной');

  const handleCreateRoom = () => {
    const queryParams = new URLSearchParams({ players, gameType }).toString();
    navigate(`/game?${queryParams}`);
  };

  const handleJoinRoom = () => {
    navigate('/join');
  };

  return (
    <div className="lobby-container">
      <h1 className="lobby-title">Добро пожаловать в Дурак Онлайн</h1>
      
      <select
        className="lobby-select"
        value={players}
        onChange={(e) => setPlayers(Number(e.target.value))}
      >
        <option value={2}>2 игрока</option>
        <option value={4}>4 игрока</option>
        <option value={6}>6 игроков</option>
      </select>

      <select
        className="lobby-select"
        value={gameType}
        onChange={(e) => setGameType(e.target.value)}
      >
        <option value="подкидной">Подкидной</option>
        <option value="переводной">Переводной</option>
      </select>

      <button className="lobby-button" onClick={handleCreateRoom}>Создать комнату</button>
      <button className="lobby-button" onClick={handleJoinRoom}>Присоединиться к комнате</button>
    </div>
  );
}

export default Lobby;