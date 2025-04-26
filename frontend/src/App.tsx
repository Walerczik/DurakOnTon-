import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import GameTable, { Player } from "./components/GameTable";
import Lobby from "./components/Lobby";

const socket: Socket = io("http://localhost:3001"); // Поменяй на свой сервер при необходимости

const App: React.FC = () => {
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    socket.on("playerData", (playerData: Player) => {
      setPlayer(playerData);
    });

    return () => {
      socket.off("playerData");
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
};

export default App;