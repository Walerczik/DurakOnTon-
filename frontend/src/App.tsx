import React, { useEffect, useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";

export default function App() {
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    const ws = new WebSocket("wss://<your-backend>.onrender.com");
    ws.onopen = () => ws.send(JSON.stringify({ type: "join" }));
    ws.onmessage = ({ data }) => setMsg(data.toString());
    ws.onerror = console.error;
    return () => ws.close();
  }, []);

  return (
    <div className="app-container">
      <img src={logo} alt="DurakOnTon Logo" className="logo" />
      <h1>DurakOnTon</h1>
      <p>{msg || "Ожидание соединения..."}</p>
      <button onClick={() => setMsg("Кнопка нажата!")}>Играть</button>
    </div>
  );
}
