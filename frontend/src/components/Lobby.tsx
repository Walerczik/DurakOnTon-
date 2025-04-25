import React, { useState } from 'react';
import './Lobby.css';

type Props = {
  socket: any;
};

const Lobby: React.FC<Props> = ({ socket }) => {
  const [showModes, setShowModes] = useState(false);

  const handleFindGameClick = () => {
    setShowModes(true);
  };

  const handleModeSelect = (mode: string) => {
    socket.emit('joinGame', { mode });
  };

  return (
    <div className="lobby-container">
      {!showModes ? (
        <button className="find-game-button" onClick={handleFindGameClick}>
          Найти игру
        </button>
      ) : (
        <div className="game-modes">
          <button onClick={() => handleModeSelect('classic')}>Обычный</button>
          <button onClick={() => handleModeSelect('podkidnoy')}>Подкидной</button>
          <button onClick={() => handleModeSelect('perevodnoy')}>Переводной</button>
        </div>
      )}
    </div>
  );
};

export default Lobby;
