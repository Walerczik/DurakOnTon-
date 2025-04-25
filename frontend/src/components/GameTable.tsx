import React, { useEffect, useState } from "react";
import cardBack from "../assets/card-back.png";

type Card = { suit: string; rank: string };

const ws = new WebSocket("wss://durakonton.onrender.com");

export default function GameTable() {
  const [hand, setHand] = useState<Card[]>([]);
  const [opponentCount, setOpponentCount] = useState(0);
  const [deckCount, setDeckCount] = useState(0);
  const [trump, setTrump] = useState<Card | null>(null);
  const [tableAttack, setTableAttack] = useState<Card[]>([]);
  const [tableDefend, setTableDefend] = useState<Card[]>([]);
  const [attacker, setAttacker] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.type === "waiting") {
        // можно отобразить сообщение
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
  }, []);

  const join = () => ws.send(JSON.stringify({ type: "join" }));
  const attack = (i: number) => ws.send(JSON.stringify({ type: "attack", cardIndex: i }));
  const defend = (i: number) => ws.send(JSON.stringify({ type: "defend", cardIndex: i }));
  const pass = () => ws.send(JSON.stringify({ type: "pass" }));
  const take = () => ws.send(JSON.stringify({ type: "take" }));

  return (
    <div className="game-table">
      <div className="opponent-area">
        {Array(opponentCount).fill(0).map((_, i) =>
          <img src={cardBack} alt="back" key={i} className="card-back" />
        )}
      </div>

      <div className="deck-trump">
        <div className="trump-behind">
          {trump && `${trump.rank}${trump.suit}`}
        </div>
        <img src={cardBack} alt="deck" className="card-back deck" />
        <div className="deck-size">×{deckCount}</div>
      </div>

      <div className="table-area">
        <div className="attack-row">
          {tableAttack.map((c, i) =>
            <div key={i} className="card">{c.rank}{c.suit}</div>
          )}
        </div>
        <div className="defend-row">
          {tableDefend.map((c, i) =>
            <div key={i} className="card defend">{c.rank}{c.suit}</div>
          )}
        </div>
      </div>

      <div className="hand-area">
        {hand.map((c, i) =>
          <div key={i} className="card" onClick={() =>
            current === attacker ? attack(i) : defend(i)
          }>
            {c.rank}{c.suit}
          </div>
        )}
      </div>

      <div className="controls">
        {current === attacker ? (
          <button onClick={pass} className="control-btn">Отбой</button>
        ) : (
          <button onClick={take} className="control-btn">Беру</button>
        )}
      </div>
    </div>
  );
}
