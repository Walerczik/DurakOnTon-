import React, { useState } from 'react';
import GameSettings from './GameSettings';

function Lobby({ socket, setRoomId }) {
  const [inputRoomId, setInputRoomId] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({ players: 2, mode: 'classic' });

  const handleCreateRoom = () => {
    setShowSettings(true);
  };

  const submitRoomCreation = () => {
    socket.emit('createRoom', settings);
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
      {!showSettings && (
        <button onClick={handleCreateRoom}>Создать комнату</button>
      )}
      {showSettings && (
        <GameSettings
          settings={settings}
          setSettings={setSettings}
          onSubmit={submitRoomCreation}
        />
      )}
    </div>
  );
}

export default Lobby;
