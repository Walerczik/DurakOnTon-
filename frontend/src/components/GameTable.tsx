import React, { useState } from 'react';
import { Socket } from 'socket.io-client';

export interface Card {
  suit: string;
  rank: string;
}

interface GameState {
  hand: Card[];
  deck: Card[];
}

interface GameTableProps {
  socket: Socket;
}

const GameTable: React.FC<GameTableProps> = ({ socket }) => {
  const [state, setState] = useState<GameState>({
    hand: [],
    deck: [],
  });

  const endTurn = () => {
    if (state.deck.length > 0) {
      const updatedHand = [...state.hand];
      while (updatedHand.length < 6 && state.deck.length > 0) {
        updatedHand.push(state.deck.pop()!);
      }
      setState({
        ...state,
        hand: updatedHand,
      });
    }
    socket.emit('endTurn');
  };

  return (
    <div>
      <h2>Your Hand:</h2>
      <ul>
        {state.hand.map((card, index) => (
          <li key={index}>{`${card.rank} of ${card.suit}`}</li>
        ))}
      </ul>
      <button onClick={endTurn}>End Turn</button>
    </div>
  );
};

export default GameTable;