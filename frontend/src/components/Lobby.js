import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../api';
import './Lobby.css'; // если есть отдельные стили для лобби; можно использовать styles.css

function Lobby({ setGameState }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [gameType, setGameType] = useState('podkidnoy');
  const [playersCount, setPlayersCount] = useState(2);

  const createAndJoinGame = () => {
    // Создаем игру через сокеты
    socket.emit('createGame', { gameType, playersCount });
    socket.on('gameCreated', ({ roomId: newRoomId, state }) => {
      setGameState(state);
      // После создания переходим в игру
      navigate('/game');
    });
  };

  const joinGame = () => {
    socket.emit('joinGame', { roomId, username });
    socket.on('gameUpdate', (state) => {
      setGameState(state);
      navigate('/game');
    });
  };

  return (
    <div className="lobby-container">
      <img src="/Logo.png" alt="Logo" className="logo" />
      <h2>Добро пожаловать в Durak On Ton!</h2>
      <div>
        <input
          type="text"
          placeholder="Ваше имя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="ID комнаты (или создайте новую)"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </div>
      <div>
        <h3>Выберите тип игры</h3>
        <select value={gameType} onChange={(e) => setGameType(e.target.value)}>
          <option value="podkidnoy">Подкидной</option>
          <option value="perevodnoy">Переводной</option>
        </select>
      </div>
      <div>
        <h3>Количество игроков</h3>
        <select value={playersCount} onChange={(e) => setPlayersCount(Number(e.target.value))}>
          <option value={2}>2 игрока</option>
          <option value={6}>6 игроков</option>
        </select>
      </div>
      <div>
        <button onClick={roomId ? joinGame : createAndJoinGame}>
          {roomId ? 'Присоединиться к игре' : 'Создать игру'}
        </button>
      </div>
    </div>
  );
}

export default Lobby;
