import React, { useEffect, useState } from "react";
import cardBack from "../assets/card-back.png";
import "../styles.css";

type Card = { suit: string; rank: string };

export default function GameTable() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [hand, setHand] = useState<Card[]>([]);
  const [opponentCount, setOpponentCount] = useState(0);
  const [deckCount, setDeckCount] = useState(0);
  const [trump, setTrump] = useState<Card | null>(null);
  const [tableAttack, setTableAttack] = useState<Card[]>([]);
  const [tableDefend, setTableDefend] = useState<Card[]>([]);
  const [attacker, setAttacker] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const socket = new WebSocket("wss://durakonton.onrender.com");
    socket.onopen = () => {
      // сразу после открытия соединения шлём JOIN
      socket.send(JSON.stringify({ type: "join" }));
    };
    socket.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.type === "waiting") {
        // можно показать «Ждём второго…»
        return;
      }
      if (d.type === "update") {
        setHand(d.hand);
        setOpponentCount(d.opponentCount);
        setDeckCount(d.deckCount);
        setTrump(d.trump);
        setTableAttack(d.tableAttack);
        setTableDefend(d.tableDefend);
        setAttacker(d.attacker);
        setCurrent(d.current);
      }
    };
    socket.onerror = console.error;
    setWs(socket);
    return () => socket.close();
  }, []);

  const attack = (i: number) => {
    if (ws && current === attacker) {
      ws.send(JSON.stringify({ type: "attack", cardIndex: i }));
    }
  };
  const defend = (i: number) => {
    if (ws && current !== attacker) {
      ws.send(JSON.stringify({ type: "defend", cardIndex: i }));
    }
  };
  const pass = () => {
    if (ws && current === attacker) {
      ws.send(JSON.stringify({ type: "pass" }));
    }
  };
  const take = () => {
    if (ws && current !== attacker) {
      ws.send(JSON.stringify({ type: "take" }));
    }
  };

  return (
    <div className="game-table">
      {/* Рука оппонента */}
      <div className="opponent-area">
        {Array.from({ length: opponentCount }).map((_, i) => (
          <img
            key={i}
            src={cardBack}
            alt="back"
            className="card-back"
          />
        ))}
      </div>

      {/* Стопка + козырь */}
      <div className="deck-trump">
        <div className="trump-behind">
          {trump && `${trump.rank}${trump.suit}`}
        </div>
        <img
          src={cardBack}
          alt="deck"
          className="card-back deck"
        />
        <div className="deck-size">×{deckCount}</div>
      </div>

      {/* Игровой стол */}
      <div className="table-area">
        <div className="attack-row">
          {tableAttack.map((c, i) => (
            <div key={i} className="card">
              {c.rank}
              {c.suit}
            </div>
          ))}
        </div>
        <div className="defend-row">
          {tableDefend.map((c, i) => (
            <div key={i} className="card defend">
              {c.rank}
              {c.suit}
            </div>
          ))}
        </div>
      </div>

      {/* Ваша рука */}
      <div className="hand-area">
        {hand.map((c, i) => (
          <div
            key={i}
            className="card"
            onClick={() =>
              current === attacker ? attack(i) : defend(i)
            }
          >
            {c.rank}
            {c.suit}
          </div>
        ))}
      </div>

      {/* Кнопки */}
      <div className="controls">
        {current === attacker ? (
          <button onClick={pass} className="control-btn">
            Отбой
          </button>
        ) : (
          <button onClick={take} className="control-btn">
            Беру
          </button>
        )}
      </div>
    </div>
  );
}