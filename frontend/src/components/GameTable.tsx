import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export type Card = { suit: string; value: string };

interface Props {
  socket: Socket;
  player: { id: string; hand: Card[] };
}

const GameTable: React.FC<Props> = ({ socket, player }) => {
  const [opponentHand, setOpponentHand] = useState<number>(0);
  const [tableCards, setTableCards] = useState<Card[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(false);

  useEffect(() => {
    socket.on("gameState", (state) => {
      setOpponentHand(state.opponentHand);
      setTableCards(state.tableCards);
      setIsPlayerTurn(state.currentPlayerId === player.id);
    });

    socket.emit("joinGame", player.id);

    return () => {
      socket.off("gameState");
    };
  }, [socket, player.id]);

  const handlePlayCard = (card: Card) => {
    if (isPlayerTurn) {
      socket.emit("playCard", card);
    }
  };

  return (
    <div>
      <h2>Game Table</h2>
      <p>Opponent's cards: {opponentHand}</p>
      <div>
        <h3>Table</h3>
        {tableCards.map((card, index) => (
          <div key={index}>
            {card.value} of {card.suit}
          </div>
        ))}
      </div>
      <div>
        <h3>Your Hand</h3>
        {player.hand.map((card, index) => (
          <button key={index} onClick={() => handlePlayCard(card)}>
            {card.value} of {card.suit}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameTable;