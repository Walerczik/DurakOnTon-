import React from 'react';
import './Card.css';

interface CardProps {
  card: { suit: string; value: string };
  onClick?: () => void;
  className?: string;
  rotated?: boolean;
}

const Card = ({ card, onClick, className = '', rotated = false }: CardProps) => {
  return (
    <div
      className={`card ${className} ${rotated ? 'rotated' : ''}`}
      onClick={onClick}
    >
      <div className="card-value">{card.value}</div>
      <div className="card-suit">{card.suit}</div>
    </div>
  );
};

export default Card;
