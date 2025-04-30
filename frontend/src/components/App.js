import React, { useState } from 'react';
import io from 'socket.io-client';
import Lobby from './Lobby';
import GameRoom from './GameRoom';

const socket = io('http://localhost:5000');

function App() {
  const [roomId, setRoomId] = useState(null);
  const [gameState, setGameState] = useState(null);

  socket.on('startGame', (state) => {
    setGameState(state);
  });

  socket.on('gameStateUpdate', (state) => {
    setGameState(state);
  });

  return (
    <div className="App">
      {roomId && gameState ? (
        <GameRoom socket={socket} roomId={roomId} gameState={gameState} />
      ) : (
        <Lobby socket={socket} setRoomId={setRoomId} />
      )}
    </div>
  );
}

export default App;
