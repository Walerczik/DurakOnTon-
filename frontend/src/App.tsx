import React from 'react';
import './App.css';
//import logo from './assets/logo.png';

function App() {
  return (
    <div className="app-container">
      <img src={logo} alt="DurakOnTon Logo" className="logo" />
      <h1>DurakOnTon</h1>
      <p>Добро пожаловать! Подключайтесь к игре</p>
      <button onClick={() => alert('Скоро будет игра!')}>Играть</button>
    </div>
  );
}

export default App;
