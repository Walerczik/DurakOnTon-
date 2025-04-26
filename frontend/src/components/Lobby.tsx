import React from 'react';
import { useNavigate } from 'react-router-dom';

const Lobby: React.FC = () => {
  const navigate = useNavigate();

  const startGame = () => {
    navigate('/game');
  };

  return (
    <div>
      <h1>Lobby</h1>
      <button onClick={startGame}>Start Game</button>
    </div>
  );
};

export default Lobby;