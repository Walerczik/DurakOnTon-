import React from 'react';
import Card from './Card';

function PlayerHand({ hand }) {
  return (
    <div className="player-hand">
      <h3>Ваши карты (всего: {hand.length})</h3>
      <div className="cards-container">
        {hand.map((card, idx) => (
          <Card key={idx} card={card} />
        ))}
      </div>
    </div>
  );
}

export default PlayerHand;
