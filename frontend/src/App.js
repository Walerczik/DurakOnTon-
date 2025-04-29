import React, { useState } from 'react';
import io from 'socket.io-client';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import './App.css';

const socket = io('http://localhost:3001'); // Убедись, что бекенд доступен по этому адресу

function App() {
  const [roomId, setRoomId] = useState('');
  const [playerHand, setPlayerHand] = useState([]);
  const [inGame, setInGame] = useState(false);

  socket.on('gameStarted', (hand) => {
    setPlayerHand(hand);
    setInGame(true);
  });

  return (
    <div className="App">
      {!inGame ? (
        <Lobby socket={socket} setRoomId={setRoomId} />
      ) : (
        <GameBoard socket={socket} playerHand={playerHand} roomId={roomId} />
      )}
    </div>
  );
}

export default App;
