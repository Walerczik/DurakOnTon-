import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Lobby.css';

const Lobby = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    navigate(`/room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  const logo = process.env.PUBLIC_URL + '/logo.png';

  return (
    <div className="lobby-container">
      <img src={logo} alt="Logo" className="background-logo" />
      <div className="lobby-box">
        <h1>Добро пожаловать в Дурака на TON</h1>
        <button onClick={createRoom}>Создать комнату</button>
        <input
          type="text"
          placeholder="Введите ID комнаты"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Присоединиться</button>
      </div>
    </div>
  );
};

export default Lobby;