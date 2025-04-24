import React from 'react';
import './App.css';
import logo from './assets/logo.png';

function App() {
  const joinGame = () => {
    // TODO: реализовать логику подключения
    console.log('Joining game...');
  };

  return (
    <div className="app-container">
      <img src={logo} alt="DurakOnTon Logo" className="logo" />
      <h1>DurakOnTon</h1>
      <p>Ожидание второго игрока...</p>
      <button onClick={joinGame}>Присоединиться</button>
    </div>
  );
}

export default App;
