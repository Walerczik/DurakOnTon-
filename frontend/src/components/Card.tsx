import { Card as CardType } from "../types/Card";
import CardBack from "../assets/CardBack.png";

type CardProps = {
  card: CardType;
  onClick?: () => void;
};

function Card({ card, onClick }: CardProps) {
  if (!card) {
    return <img src={CardBack} className="card" alt="Back" />;
  }
  return (
    <div className="card" onClick={onClick}>
      {card.suit} {card.rank}
    </div>
  );
}

export default Card;
