import React, { useEffect, useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";

export default function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [hand, setHand] = useState<any[]>([]);
  const [trump, setTrump] = useState<any>(null);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    const socket = new WebSocket("wss://durakonton.onrender.com");
    socket.onopen = () => console.log("WS connected");
    socket.onmessage = e => {
      const data = JSON.parse(e.data);
      if (data.type === "waiting") setMsg(data.message);
      if (data.type === "gameStart") {
        setHand(data.hand);
        setTrump(data.trump);
        setMsg(data.yourTurn ? "Ваш ход" : "Ход оппонента");
      }
      if (data.type === "cardPlayed") {
        setMsg(`Игрок ${data.player} сыграл ${data.card.rank}${data.card.suit}`);
      }
    };
    socket.onerror = console.error;
    setWs(socket);
    return () => socket.close();
  }, []);

  const joinGame = () => ws?.send(JSON.stringify({ type: "join" }));
  const playCard = (i: number) => ws?.send(JSON.stringify({ type: "attack", cardIndex: i }));

  return (
    <div className="app-container">
      <img src={logo} alt="Logo" className="logo" />
      <h1>DurakOnTon</h1>
      {hand.length === 0 ? (
        <button onClick={joinGame}>Join Game</button>
      ) : (
        <>
          <p>Trump: {trump.rank}{trump.suit}</p>
          <div className="hand">
            {hand.map((c, i) => (
              <button key={i} onClick={() => playCard(i)}>
                {c.rank}{c.suit}
              </button>
            ))}
          </div>
        </>
      )}
      <p className="msg">{msg}</p>
    </div>
  );
}
