import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface LobbyProps {
  socket: Socket;
}

interface Player {
  id: string;
  name: string;
}

const Lobby: React.FC<LobbyProps> = ({ socket }) => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    socket.on('playersUpdate', (updatedPlayers: Player[]) => {
      setPlayers(updatedPlayers);
    });

    return () => {
      socket.off('playersUpdate');
    };
  }, [socket]);

  const handleStartGame = () => {
    socket.emit('startGame');
  };

  return (
    <div>
      <h2>Lobby</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
      <button onClick={handleStartGame}>Start Game</button>
    </div>
  );
};

export default Lobby;