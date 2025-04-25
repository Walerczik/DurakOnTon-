// frontend/src/App.tsx

import React, { useEffect, useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";

type Card = { suit: string; rank: string };

export default function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [joined, setJoined] = useState(false);
  const [hand, setHand] = useState<Card[]>([]);
  const [tableAttack, setTableAttack] = useState<Card[]>([]);
  const [tableDefend, setTableDefend] = useState<Card[]>([]);
  const [trump, setTrump] = useState<Card | null>(null);
  const [deckCount, setDeckCount] = useState(0);
  const [yourTurn, setYourTurn] = useState(false);
  const [msg, setMsg] = useState<string>("Подключаемся...");

  useEffect(() => {
    const socket = new WebSocket("wss://durakonton.onrender.com");

    socket.onopen = () => {
      setConnected(true);
      setMsg("Готов к игре");
    };

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      switch (data.type) {
        case "waiting":
          setMsg(data.message);
          break;
        case "gameStart":
          setHand(data.hand);
          setTrump(data.trump);
          setDeckCount(data.deckCount);
          setYourTurn(data.yourTurn);
          setMsg(data.yourTurn ? "Ваш ход" : "Ход соперника");
          break;
        case "cardPlayed":
          setTableAttack((t) => [...t, data.card]);
          setYourTurn(!yourTurn);
          setMsg(yourTurn ? "Вы атаковали" : "Соперник атаковал");
          break;
        case "defended":
          setTableDefend((t) => [...t, data.card]);
          setYourTurn(true);
          setMsg("Вы отбили");
          break;
        case "taken":
          setHand((h) => [...h, ...tableAttack, ...tableDefend]);
          setTableAttack([]);
          setTableDefend([]);
          setYourTurn(false);
          setMsg("Вы взяли карты");
          break;
        default:
          console.log("Unknown:", data);
      }
    };

    socket.onerror = () => setMsg("Ошибка соединения");
    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const joinGame = () => {
    if (ws && connected && !joined) {
      ws.send(JSON.stringify({ type: "join" }));
      setJoined(true);
      setMsg("Запрошено подключение...");
    }
  };

  const playCard = (i: number) => {
    if (!yourTurn) return;
    ws?.send(JSON.stringify({ type: "attack", cardIndex: i }));
    setHand((h) => h.filter((_, idx) => idx !== i));
  };

  const defend = () => {
    if (!yourTurn || tableAttack.length === tableDefend.length) return;
    ws?.send(
      JSON.stringify({
        type: "defend",
        cardIndex: tableAttack[tableDefend.length],
      })
    );
  };

  const takeCards = () => {
    ws?.send(JSON.stringify({ type: "take" }));
  };

  return (
    <div className="app-container">
      <img src={logo} className="logo" alt="DurakOnTon Logo" />
      <h1 className="title">DurakOnTon</h1>

      {!joined ? (
        <button
          className="btn-big"
          onClick={joinGame}
          disabled={!connected}
        >
          {connected ? "Присоединиться" : "Подключение..."}
        </button>
      ) : (
        <>
          <div className="opponent-hand">
            {Array(deckCount)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="card-back">🂠</div>
              ))}
          </div>

          <div className="deck-area">
            <div className="card-back deck-card">🂠</div>
            <span className="deck-count">{deckCount}</span>
            <div className="card trump-card">
              {trump?.rank}
              {trump?.suit}
            </div>
          </div>

          <div className="table">
            <div className="attack">
              {tableAttack.map((c, i) => (
                <div key={i} className="card">
                  {c.rank}
                  {c.suit}
                </div>
              ))}
            </div>
            <div className="defend">
              {tableDefend.map((c, i) => (
                <div key={i} className="card defend-card">
                  {c.rank}
                  {c.suit}
                </div>
              ))}
            </div>
          </div>

          <div className="hand">
            {hand.map((c, i) => (
              <div
                key={i}
                className="card"
                onClick={() => playCard(i)}
              >
                {c.rank}
                {c.suit}
              </div>
            ))}
          </div>

          <div className="actions">
            <button
              className="btn-small"
              onClick={defend}
              disabled={!yourTurn}
            >
              Отбой
            </button>
            <button className="btn-small" onClick={takeCards}>
              Беру
            </button>
          </div>
        </>
      )}

      <div className="msg">{msg}</div>
    </div>
  );
}