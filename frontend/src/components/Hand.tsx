import { Card as CardType } from "../types/Card";
import Card from "./Card";

type HandProps = {
  hand: CardType[];
};

function Hand({ hand }: HandProps) {
  return (
    <div className="hand">
      {hand.map((card, idx) => (
        <Card key={idx} card={card} />
      ))}
    </div>
  );
}

export default Hand;
