import React from 'react';

function TrumpCard({ suit, value }) {
  return (
    <div className="trump-card">
      <h3>Козырь: {value} {suit}</h3>
    </div>
  );
}

export default TrumpCard;
