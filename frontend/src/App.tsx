// frontend/src/App.tsx

import React, { useEffect, useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";

type Card = { suit: string; rank: string };

export default function App() {
  const [ws, setWs] = useState<WebSocket|null>(null);
  const [hand, setHand] = useState<Card[]>([]);
  const [tableAttack, setTableAttack] = useState<Card[]>([]);
  const [tableDefend, setTableDefend] = useState<Card[]>([]);
  const [trump, setTrump] = useState<Card|null>(null);
  const [deckCount, setDeckCount] = useState<number>(0);
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
          setDeckCount(data.deckCount);
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
          setHand(h => [...h, ...tableAttack, ...tableDefend]);
          setTableAttack([]);
          setTableDefend([]);
          setYourTurn(false);
          setMsg("Вы взяли карты");
          break;
      }
    };
    socket.onerror = console.error;
    setWs(socket);
    return () => socket.close();
  }, [yourTurn, tableAttack, tableDefend]);

  const joinGame = () => ws?.send(JSON.stringify({ type:"join" }));
  const playCard = (i:number) => {
    if (!yourTurn) return;
    ws?.send(JSON.stringify({ type:"attack", cardIndex: i }));
    setHand(h => h.filter((_,idx)=>idx!==i));
  };
  const defend = () => {
    if (!yourTurn || tableAttack.length === tableDefend.length) return;
    ws?.send(JSON.stringify({ type:"defend", cardIndex: tableAttack[tableDefend.length] }));
  };
  const takeCards = () => ws?.send(JSON.stringify({ type:"take" }));

  return (
    <div className="app-container">
      <img src={logo} alt="Logo" className="logo" />
      <h1>DurakOnTon</h1>

      {hand.length === 0 ? (
        <button className="btn-big" onClick={joinGame}>Присоединиться</button>
      ) : (
        <>
          {/* Рука оппонента (рубашки) */}
          <div className="opponent-hand">
            {Array(deckCount).fill(0).map((_,i) => (
              <div key={i} className="card-back">🂠</div>
            ))}
          </div>

          {/* Колода и козырь */}
          <div className="deck-area">
            <div className="card-back deck-card">🂠</div>
            <span className="deck-count">{deckCount}</span>
            <div className="card trump-card">{trump?.rank}{trump?.suit}</div>
          </div>

          {/* Стол */}
          <div className="table">
            <div className="attack">
              {tableAttack.map((c,i) => <div key={i} className="card">{c.rank}{c.suit}</div>)}
            </div>
            <div className="defend">
              {tableDefend.map((c,i) => <div key={i} className="card defend-card">{c.rank}{c.suit}</div>)}
            </div>
          </div>

          {/* Ваша рука */}
          <div className="hand">
            {hand.map((c,i)=><div key={i} className="card" onClick={()=>playCard(i)}>{c.rank}{c.suit}</div>)}
          </div>

          {/* Действия */}
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