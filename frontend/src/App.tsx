import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Lobby from "./components/Lobby";
import GameTable from "./components/GameTable";

export interface Card {
  suit: string;
  rank: string;
}

export interface Player {
  id: string;
  hand: Card[];
}

export interface GameState {
  deck: Card[];
  players: Player[];
}

const socket: Socket = io("https://durak-server-weld.vercel.app/");

function App() {
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
}

export default App;