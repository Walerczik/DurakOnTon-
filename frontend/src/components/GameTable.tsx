import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

const GameTable: React.FC = () => {
  const { state, setState } = useContext(GameContext);

  const endTurn = () => {
    if (state.deck.length > 0) {
      const updatedHand = [...state.hand];
      while (updatedHand.length < 6 && state.deck.length > 0) {
        const card = state.deck.pop();
        if (card) {
          updatedHand.push(card);
        }
      }
      setState(prevState => ({
        ...prevState,
        hand: updatedHand,
      }));
    }
  };

  return (
    <div>
      <h2>Game Table</h2>
      <button onClick={endTurn}>End Turn</button>
    </div>
  );
};

export default GameTable;