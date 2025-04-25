import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import GameTable from './components/GameTable';
import Lobby from './components/Lobby';

const socket = io(process.env.REACT_APP_BACKEND_URL || 'https://durakonton.onrender.com');

function App() {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('playerAssigned', (playerData) => {
      setPlayer(playerData);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      {player ? (
        <GameTable socket={socket} player={player} />
      ) : (
        <Lobby socket={socket} />
      )}
    </div>
  );
}

export default App;