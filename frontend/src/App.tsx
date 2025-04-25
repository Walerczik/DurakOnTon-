import React, { useEffect, useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";

type Card = { suit: string; rank: string };

export default function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [joined, setJoined] = useState(false);

  const [hand, setHand] = useState<Card[]>([]);
  const [opponentCount, setOpponentCount] = useState(0);
  const [deckCount, setDeckCount] = useState(0);
  const [trump, setTrump] = useState<Card | null>(null);
  const [tableAttack, setTableAttack] = useState<Card[]>([]);
  const [tableDefend, setTableDefend] = useState<Card[]>([]);
  const [yourTurn, setYourTurn] = useState(false);
  const [role, setRole] = useState<"attacker" | "defender">("attacker");
  const [msg, setMsg] = useState("Подключение...");

  useEffect(() => {
    const socket = new WebSocket("wss://durakonton.onrender.com");
    socket.onopen = () => setMsg("Готов к игре");
    socket.onmessage = e => {
      const d = JSON.parse(e.data);
      if (d.type === "waiting") {
        setMsg(d.message);
      } else if (d.type === "update") {
        setHand(d.hand);
        setOpponentCount(d.opponentCount);
        setDeckCount(d.deckCount);
        setTrump(d.trump);
        setTableAttack(d.tableAttack);
        setTableDefend(d.tableDefend);
        setYourTurn(d.yourTurn);
        setRole(d.role);
        if (!joined) setJoined(true);
        setMsg(
          d.yourTurn
            ? d.role === "attacker"
              ? "Ваш ход: атакуйте"
              : "Ваш ход: отбивайтесь"
            : "Ожидание хода соперника"
        );
      }
    };
    socket.onerror = () => setMsg("Ошибка соединения");
    setWs(socket);
    return () => socket.close();
  }, [joined]);

  const joinGame = () => {
    ws?.send(JSON.stringify({ type: "join" }));
    setMsg("Запрошено подключение...");
  };

  const playAttack = (i: number) => {
    if (role === "attacker" && yourTurn) {
      ws?.send(JSON.stringify({ type: "attack", cardIndex: i }));
    }
  };

  const playDefend = (i: number) => {
    if (role === "defender" && yourTurn) {
      ws?.send(JSON.stringify({ type: "defend", cardIndex: i }));
    }
  };

  const pass = () => {
    if (role === "attacker" && yourTurn) {
      ws?.send(JSON.stringify({ type: "pass" }));
    }
  };

  const take = () => {
    if (role === "defender" && yourTurn) {
      ws?.send(JSON.stringify({ type: "take" }));
    }
  };

  return (
    <div className="app-container">
      <img src={logo} className="logo" alt="DurakOnTon Logo" />
      <h1 className="title">DurakOnTon</h1>

      {!joined ? (
        <button className="btn-big" onClick={joinGame}>
          {msg.includes("Готов") ? "Присоединиться" : msg}
        </button>
      ) : (
        <>
          <div className="deck-trump-area">
            <div className="deck-stack">
              <div className="card-back deck-card">🂠</div>
              <div className="deck-count">×{deckCount}</div>
            </div>
            <div className="trump-card">
              {trump?.rank}
              {trump?.suit}
            </div>
          </div>

          <div className="opponent-hand">
            {Array(opponentCount)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="card-back">🂠</div>
              ))}
          </div>

          <div className="table">
            <div className="attack">
              {tableAttack.map((c, i) => (
                <div key={i} className="card">{c.rank}{c.suit}</div>
              ))}
            </div>
            <div className="defend">
              {tableDefend.map((c, i) => (
                <div key={i} className="card defend-card">{c.rank}{c.suit}</div>
              ))}
            </div>
          </div>

          <div className="hand">
            {hand.map((c, i) => (
              <div
                key={i}
                className="card"
                onClick={() =>
                  role === "attacker"
                    ? playAttack(i)
                    : role === "defender"
                    ? playDefend(i)
                    : null
                }
              >
                {c.rank}{c.suit}
              </div>
            ))}
          </div>

          <div className="actions">
            {role === "attacker" ? (
              <button className="btn-small" onClick={pass} disabled={!yourTurn}>
                Отбой
              </button>
            ) : (
              <button className="btn-small" onClick={take} disabled={!yourTurn}>
                Беру
              </button>
            )}
          </div>
        </>
      )}

      <div className="msg">{msg}</div>
    </div>
  );
}