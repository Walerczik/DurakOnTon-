import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import "./GameTable.css";
import cardBack from "../assets/card-back.png";

export type Card = { suit: string; value: string };

interface TablePair { attack: Card; defense?: Card }

interface Props {
  socket: Socket;
  player: { id: string; hand: Card[] };
}

const GameTable: React.FC<Props> = ({ socket, player }) => {
  const [opponentHandCount, setOpponentHandCount] = useState(0);
  const [tableCards, setTableCards] = useState<TablePair[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [trumpCard, setTrumpCard] = useState<Card | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isDefending, setIsDefending] = useState(false);
  const [hand, setHand] = useState<Card[]>(player.hand);

  useEffect(() => {
    // При подключении сервер шлёт initial state вместе с player.hand в App
    // Дальше он шлёт «update» on game events
    socket.on("update", (data: {
      playerHand: Card[];
      opponentHandCount: number;
      tableCards: TablePair[];
      deck: Card[];
      trumpCard: Card;
      isMyTurn: boolean;
      isDefending: boolean;
    }) => {
      setHand(data.playerHand);
      setOpponentHandCount(data.opponentHandCount);
      setTableCards(data.tableCards);
      setDeck(data.deck);
      setTrumpCard(data.trumpCard);
      setIsMyTurn(data.isMyTurn);
      setIsDefending(data.isDefending);
    });

    return () => {
      socket.off("update");
    };
  }, [socket]);

  const onPlay = (idx: number) => {
    if (!isMyTurn) return;
    socket.emit(isDefending ? "defend" : "attack", { cardIndex: idx });
  };

  const onPass = () => {
    if (isMyTurn && !isDefending) socket.emit("pass");
  };

  const onTake = () => {
    if (isMyTurn && isDefending) socket.emit("take");
  };

  return (
    <div className="game-table">
      {/* Оппонент сверху */}
      <div className="opponent-hand">
        {Array(opponentHandCount).fill(0).map((_, i) => (
          <img key={i} src={cardBack} className="card" alt="back" />
        ))}
      </div>

      {/* Игровой стол */}
      <div className="table-cards">
        {tableCards.map((pair, i) => (
          <div key={i} className="card-pair">
            <img
              src={`/cards/${pair.attack.value}_of_${pair.attack.suit}.png`}
              alt="attack"
              className="card"
            />
            {pair.defense && (
              <img
                src={`/cards/${pair.defense.value}_of_${pair.defense.suit}.png`}
                alt="defense"
                className="card defense"
              />
            )}
          </div>
        ))}
      </div>

      {/* Ваша рука */}
      <div className="player-hand">
        {hand.map((c, i) => (
          <img
            key={i}
            src={`/cards/${c.value}_of_${c.suit}.png`}
            alt={`${c.value} of ${c.suit}`}
            className="card"
            onClick={() => onPlay(i)}
          />
        ))}
      </div>

      {/* Кнопки */}
      <div className="action-buttons">
        {!isDefending ? (
          <button onClick={onPass} disabled={!isMyTurn}>
            Отбой
          </button>
        ) : (
          <button onClick={onTake} disabled={!isMyTurn}>
            Беру
          </button>
        )}
      </div>

      {/* Колода + козырь */}
      <div className="deck-area">
        {deck.length > 1 && (
          <img src={cardBack} className="card" alt="deck" />
        )}
        {trumpCard && (
          <img
            src={`/cards/${trumpCard.value}_of_${trumpCard.suit}.png`}
            className="card trump-card"
            alt="trump"
          />
        )}
        <div className="deck-count">×{deck.length}</div>
      </div>
    </div>
  );
};

export default GameTable;