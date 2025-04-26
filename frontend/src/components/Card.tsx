interface CardProps {
  value: string;
  suit: string;
}

const Card: React.FC<CardProps> = ({ value, suit }) => {
  return (
    <div className="card" style={{ display: 'inline-block', margin: '10px' }}>
      <img src="/back_of_card.png" alt="Card Back" style={{ width: '80px' }} />
      <div>{value} {suit}</div>
    </div>
  );
};

export default Card;
