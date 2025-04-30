import React from 'react';

function GameRoom({ socket, roomId, gameState }) {
  const handleMove = (move) => {
    socket.emit('playerMove', { roomId, move });
  };

  return (
    <div className="game-room">
      <h2>Комната: {roomId}</h2>
      {/* Здесь будет отображение состояния игры и интерфейс для ходов */}
      {/* Пример: */}
      <div>
        <p>Текущий игрок: {gameState.currentPlayer}</p>
        {/* Отображение карт, стола и т.д. */}
      </div>
      <button onClick={() => handleMove({ /* данные хода */ })}>Сделать ход</button>
    </div>
  );
}

export default GameRoom;
