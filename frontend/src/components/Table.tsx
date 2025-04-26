import { Card as CardType } from "../types/Card";
import Card from "./Card";

type TableProps = {
  table: { attack: CardType; defense?: CardType }[];
};

function Table({ table }: TableProps) {
  return (
    <div className="table">
      {table.map((pair, idx) => (
        <div key={idx} className="pair">
          <Card card={pair.attack} />
          {pair.defense && <Card card={pair.defense} />}
        </div>
      ))}
    </div>
  );
}

export default Table;
