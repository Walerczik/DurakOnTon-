import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import GameOverScreen from './components/GameOverScreen';

function App() {
  const [gameState, setGameState] = useState(null);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Lobby setGameState={setGameState} />} />
          <Route path="/game" element={<GameBoard gameState={gameState} />} />
          <Route path="/gameover" element={<GameOverScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
