import React, { useState } from 'react';
import './GameTable.css';

interface Card {
  suit: string;
  value: string;
}

interface GameState {
  deck: Card[];
  hand: Card[];
}

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push({ suit, value });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

const GameTable: React.FC = () => {
  const [state, setState] = useState<GameState>({
    deck: createDeck(),
    hand: [],
  });

  const endTurn = () => {
    if (state.deck.length > 0) {
      const updatedHand = [...state.hand];
      while (updatedHand.length < 6 && state.deck.length > 0) {
        updatedHand.push(state.deck.pop()!);
      }
      setState({
        deck: [...state.deck],
        hand: updatedHand,
      });
    }
  };

  return (
    <div className="game-table">
      <h1>Game Table</h1>
      <div className="hand">
        {state.hand.map((card, index) => (
          <div key={index} className="card">
            {card.value} of {card.suit}
          </div>
        ))}
      </div>
      <button onClick={endTurn}>End Turn</button>
    </div>
  );
};

export default GameTable;