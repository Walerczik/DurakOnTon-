import React from "react";
import { Socket } from "socket.io-client";
import { Card, Player } from "../App";

interface GameTableProps {
  socket: Socket;
  player: Player;
}

const GameTable: React.FC<GameTableProps> = ({ socket, player }) => {
  const endTurn = () => {
    socket.emit("endTurn");
  };

  return (
    <div>
      <h2>Game Table</h2>
      <div>
        <h3>Your Hand:</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          {player.hand.map((card, index) => (
            <div key={index} style={{ border: "1px solid black", padding: "5px" }}>
              {card.rank} of {card.suit}
            </div>
          ))}
        </div>
      </div>
      <button onClick={endTurn}>End Turn</button>
    </div>
  );
};

export default GameTable;