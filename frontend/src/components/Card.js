import React from 'react';
import cardBack from 'card_back.png';

function Card({ hidden }) {
  return (
    <div className="card">
      <img src={hidden ? cardBack : 'https://upload.wikimedia.org/wikipedia/commons/5/57/Playing_card_heart_6.svg'} alt="Card" />
    </div>
  );
}

export default Card;
