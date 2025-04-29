import React, { useState } from 'react';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Адрес backend-сервера

function App() {
  const [inGame, setInGame] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [playerHand, setPlayerHand] = useState([]);

  return (
    <div className="App">
      {inGame
        ? <GameBoard socket={socket} playerHand={playerHand} roomId={roomId} />
        : <Lobby socket={socket} setInGame={setInGame} setRoomId={setRoomId} setPlayerHand={setPlayerHand} />}
    </div>
  );
}

export default App;
