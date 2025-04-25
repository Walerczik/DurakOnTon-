import React, { useEffect, useState } from "react";
import "./App.css";
import Lobby from "./components/Lobby";
import GameTable from "./components/GameTable";
import { io, Socket } from "socket.io-client";
import { Card } from "./components/GameTable";

export interface Player {
  id: string;
  hand: Card[];
}

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || "https://durakonton.onrender.com";
const socket: Socket = io(SOCKET_URL);

function App() {
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    // Событие при инициализации — присвоение игрока
    socket.on("init", (data: { player: Player }) => {
      setPlayer(data.player);
    });
    // После чего сервер шлёт начальные данные и игрок считается «в лобби»
    // Далее сервер будет рассылать «update» внутри GameTable

    return () => {
      socket.off("init");
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