import React, { useState } from "react";
import { Socket } from "socket.io-client";

export interface Card {
  suit: string;
  value: number;
}

export interface Player {
  id: string;
  hand: Card[];
}

interface GameTableProps {
  socket: Socket;
  player: Player;
}

const GameTable: React.FC<GameTableProps> = ({ socket, player }) => {
  const [deck, setDeck] = useState<Card[]>([]);

  const endTurn = () => {
    if (deck.length > 0) {
      const updatedHand = [...player.hand];
      const updatedDeck = [...deck];

      while (updatedHand.length < 6 && updatedDeck.length > 0) {
        updatedHand.push(updatedDeck.pop()!);
      }

      setDeck(updatedDeck);

      // Обновление руки игрока можно отправить на сервер, если нужно
      socket.emit("updateHand", updatedHand);
    }
  };

  return (
    <div>
      <h2>Game Table</h2>
      <div>
        <h3>Your Hand:</h3>
        <ul>
          {player.hand.map((card, index) => (
            <li key={index}>
              {card.value} of {card.suit}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={endTurn}>End Turn</button>
      </div>
    </div>
  );
};

export default GameTable;