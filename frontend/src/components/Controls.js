import React from 'react';
import { socket } from '../api';

function Controls({ roomId }) {
  const handleEndTurn = () => {
    socket.emit('end_turn', { roomId });
  };

  const handleTakeCards = () => {
    socket.emit('take_cards', { roomId });
  };

  return (
    <div className="controls">
      <button onClick={handleEndTurn}>Отбой</button>
      <button onClick={handleTakeCards}>Беру</button>
    </div>
  );
}

export default Controls;
