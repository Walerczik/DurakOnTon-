import React, { useState } from 'react';
import { Socket } from 'socket.io-client';

export interface Card {
  suit: string;
  rank: string;
}

export interface Player {
  id: string;
  name?: string;
}

interface GameState {
  hand: Card[];
  deck: Card[];
}

interface GameTableProps {
  socket: Socket;
  player: Player;
}

const GameTable: React.FC<GameTableProps> = ({ socket, player }) => {
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
    socket.emit('endTurn', { playerId: player.id });
  };

  return (
    <div>
      <h2>{player.name || 'You'}</h2>
      <h3>Your Hand:</h3>
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