import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lobby from './components/Lobby';
import GameTable from './components/GameTable';
import { GameProvider } from './context/GameContext';

const App: React.FC = () => {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/game" element={<GameTable />} />
        </Routes>
      </Router>
    </GameProvider>
  );
};

export default App;