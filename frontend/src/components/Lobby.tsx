import React from "react";
import { Socket } from "socket.io-client";

interface LobbyProps {
  socket: Socket;
}

const Lobby: React.FC<LobbyProps> = ({ socket }) => {
  const joinGame = () => {
    socket.emit("joinGame");
  };

  return (
    <div>
      <h2>Lobby</h2>
      <button onClick={joinGame}>Join Game</button>
    </div>
  );
};
export default Lobby;