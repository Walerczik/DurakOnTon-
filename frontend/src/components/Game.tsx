import { useEffect, useState } from "react";
import { socket } from "../api/socket";
import { Card as CardType } from "../types/Card";
import { Player } from "../types/Player";
import Hand from "./Hand";
import Table from "./Table";
import Controls from "./Controls";
import PlayersList from "./PlayersList";
import GameOver from "./GameOver";

function Game() {
  const [hand, setHand] = useState<CardType[]>([]);
  const [table, setTable] = useState<{ attack: CardType; defense?: CardType }[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [trump, setTrump] = useState<CardType | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    socket.on("joined", ({ playerId, hand, trumpCard }) => {
      setHand(hand);
      setTrump(trumpCard);
    });

    socket.on("updateTable", (table) => {
      setTable(table);
    });

    socket.on("updatePlayers", (players) => {
      setPlayers(players);
    });

    socket.on("gameOver", ({ winnerId }) => {
      setWinner(winnerId);
    });

    return () => {
      socket.off("joined");
      socket.off("updateTable");
      socket.off("updatePlayers");
      socket.off("gameOver");
    };
  }, []);

  if (winner) {
    return <GameOver winner={winner} />;
  }

  return (
    <div className="game">
      <PlayersList players={players} />
      {trump && <div className="trump">Козырь: {trump.suit} {trump.rank}</div>}
      <Table table={table} />
      <Hand hand={hand} />
      <Controls />
    </div>
  );
}

export default Game;
