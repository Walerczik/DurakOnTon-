import React, { useState } from 'react';
import './Lobby.css';

function Lobby({ socket, setRoomId }) {
  const [inputRoomId, setInputRoomId] = useState('');

  const createRoom = () => {
    socket.emit('createRoom');
    socket.on('roomCreated', (roomId) => {
      setRoomId(roomId);
    });
  };

  const joinRoom = () => {
    if (inputRoomId.trim() !== '') {
      socket.emit('joinRoom', inputRoomId);
      setRoomId(inputRoomId);
    }
  };

  return (
    <div className="lobby-container">
      <h2>Добро пожаловать в Дуpaк</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Введите ID комнаты"
          value={inputRoomId}
          onChange={(e) => setInputRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Присоединиться</button>
      </div>
      <button onClick={createRoom}>Создать комнату</button>
    </div>
  );
}

export default Lobby;