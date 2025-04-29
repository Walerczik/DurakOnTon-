import React from 'react';
import './PlayerHand.css';

const PlayerHand = ({ cards, playCard }) => {
  return (
    <div className="player-hand">
      {cards.map((card, index) => (
        <div key={index} className="card" onClick={() => playCard(card)}>
          {card}
        </div>
      ))}
    </div>
  );
};

export default PlayerHand;
