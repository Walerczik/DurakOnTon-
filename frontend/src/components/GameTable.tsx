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
    socket.onopen = () => socket.send(JSON.stringify({ type: "join" }));
    socket.onmessage = e => {
      const d = JSON.parse(e.data);
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
      {/* рука оппонента */}
      <div className="opponent-area">
        {Array.from({ length: opponentCount }).map((_, i) => (
          <img key={i} src={cardBack} className="card-back" alt="back" />
        ))}
      </div>

      {/* колода + trump */}
      <div className="deck-trump">
        <div className="trump-behind">
          {trump && `${trump.rank}${trump.suit}`}
        </div>
        <img src={cardBack} className="card-back deck" alt="deck" />
        <div className="deck-size">×{deckCount}</div>
      </div>

      {/* стол: пары attack/defend */}
      <div className="table-area">
        {tableAttack.map((atk, i) => (
          <div key={i} className="card-pair">
            <div className="card attack-card">
              {atk.rank}{atk.suit}
            </div>
            {tableDefend[i] && (
              <div className="card defend-card">
                {tableDefend[i].rank}{tableDefend[i].suit}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ваша рука */}
      <div className="hand-area">
        {hand.map((c, i) => (
          <div
            key={i}
            className="card"
            onClick={() =>
              current === attacker ? attack(i) : defend(i)
            }
          >
            {c.rank}{c.suit}
          </div>
        ))}
      </div>

      {/* кнопки */}
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