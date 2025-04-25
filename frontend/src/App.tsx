import React, { useState } from "react";
import GameTable from "./components/GameTable";
import logo from "./assets/logo.png";
import "./styles.css";

export default function App() {
  const [joined, setJoined] = useState(false);

  return (
    <div className="app-container">
      {!joined ? (
        <div className="menu">
          <img src={logo} alt="DurakOnTon" className="logo" />
          <button
            className="start-btn"
            onClick={() => setJoined(true)}
          >
            Присоединиться к игре
          </button>
        </div>
      ) : (
        <GameTable />
      )}
    </div>
  );
}