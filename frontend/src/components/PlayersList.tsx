import { Player } from "../types/Player";

type PlayersListProps = {
  players: Player[];
};

function PlayersList({ players }: PlayersListProps) {
  return (
    <div className="players">
      {players.map((p) => (
        <div key={p.id} className="player">
          {p.name} ({p.cardsCount})
        </div>
      ))}
    </div>
  );
}

export default PlayersList;
