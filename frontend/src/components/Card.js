import React from 'react';

function Card({ card }) {
  return (
    <div className="card">
      {/* Если карта открыта, показываем её ранг и масть */}
      {card ? (
        <>
          <div>{card.rank}</div>
          <div>{card.suit}</div>
        </>
      ) : (
        <img src="/card_back.png" alt="Card Back" />
      )}
    </div>
  );
}

export default Card;
