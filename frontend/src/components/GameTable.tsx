import React, { useState } from 'react';
import { Socket } from 'socket.io-client';

interface Card {
  suit: string;
  rank: string;
}

interface GameState {
  hand: Card[];
  deck: Card[];
}

interface GameTableProps {
  socket: Socket;
  player: { id: string; name: string };
}

const GameTable: React.FC<GameTableProps> = ({ socket, player }) => {
  const [state, setState] = useState<GameState>({
    hand: [],
    deck: [],
  });

  const endTurn = () => {
    if (state.deck.length > 0) {
      const updatedHand = [...state.hand];
      const updatedDeck = [...state.deck];

      while (updatedHand.length < 6 && updatedDeck.length > 0) {
        updatedHand.push(updatedDeck.pop()!);
      }

      setState({ hand: updatedHand, deck: updatedDeck });
    }
  };

  return (
    <div>
      <h2>Game Table</h2>
      <p>Player: {player.name}</p>
      <h3>Your Hand:</h3>
      <ul>
        {state.hand.map((card, idx) => (
          <li key={idx}>{card.rank} of {card.suit}</li>
        ))}
      </ul>
      <button onClick={endTurn}>End Turn</button>
    </div>
  );
};

export default GameTable;