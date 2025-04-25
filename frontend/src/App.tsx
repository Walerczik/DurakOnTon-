import React, { useEffect, useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";

type Card = { suit: string; rank: string };

export default function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [hand, setHand] = useState<Card[]>([]);
  const [tableAttack, setTableAttack] = useState<Card[]>([]);
  const [tableDefend, setTableDefend] = useState<Card[]>([]);
  const [trump, setTrump] = useState<Card | null>(null);
  const [yourTurn, setYourTurn] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    const socket = new WebSocket("wss://durakonton.onrender.com");
    socket.onopen = () => console.log("WS connected");
    socket.onmessage = e => {
      const data = JSON.parse(e.data);
      switch (data.type) {
        case "waiting":
          setMsg(data.message);
          break;
        case "gameStart":
          setHand(data.hand);
          setTrump(data.trump);
          setYourTurn(data.yourTurn);
          setMsg(data.yourTurn ? "Ваш ход" : "Ход соперника");
          break;
        case "cardPlayed":
          setTableAttack(tbl => [...tbl, data.card]);
          setYourTurn(!yourTurn);
          setMsg(yourTurn ? "Вы атаковали" : "Соперник атаковал");
          break;
        case "defended":
          setTableDefend(tbl => [...tbl, data.card]);
          setYourTurn(true);
          setMsg("Вы отбили");
          break;
        case "taken":
          // Добавляем все с поля в руку
          setHand(h => [...h, ...tableAttack, ...tableDefend]);
          setTableAttack([]);
          setTableDefend([]);
          setYourTurn(false);
          setMsg("Вы взяли карты");
          break;
        default:
          console.log("Unknown:", data);
      }
    };
    socket.onerror = console.error;
    setWs(socket);
    return () => socket.close();
  }, [yourTurn, tableAttack, tableDefend]);

  const joinGame = () => {
    ws?.send(JSON.stringify({ type: "join" }));
  };

  const playCard = (idx: number) => {
    if (!yourTurn) return;
    ws?.send(JSON.stringify({ type: "attack", cardIndex: idx }));
    setHand(h => h.filter((_, i) => i !== idx));
  };

  const defend = () => {
    if (!yourTurn || tableAttack.length === tableDefend.length) return;
    ws?.send(JSON.stringify({ type: "defend", cardIndex: tableAttack[tableDefend.length] }));
  };

  const takeCards = () => {
    ws?.send(JSON.stringify({ type: "take" }));
  };

  return (
    <div className="app-container">
      <img src={logo} alt="Logo" className="logo" />
      <h1>DurakOnTon</h1>
      {hand.length === 0 ? (
        <button className="btn-big" onClick={joinGame}>Join Game</button>
      ) : (
        <>
          <div className="trump">Trump: {trump?.rank}{trump?.suit}</div>
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
              <div key={i} className="card" onClick={() => playCard(i)}>
                {c.rank}{c.suit}
              </div>
            ))}
          </div>
          <div className="actions">
            <button className="btn-small" onClick={defend} disabled={!yourTurn}>Отбой</button>
            <button className="btn-small" onClick={takeCards}>Беру</button>
          </div>
        </>
      )}
      <p className="msg">{msg}</p>
    </div>
  );
}